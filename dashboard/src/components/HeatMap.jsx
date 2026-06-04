import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AlertTriangle, Radio } from 'lucide-react';

// ─── Grid size ────────────────────────────────────────────────────────────────
const ROWS = 20;
const COLS = 20;

// ─── Sensor layout ────────────────────────────────────────────────────────────
// Each sensor: side, fractional position along that edge (0=start, 1=end)
const SENSOR_META = {
  S1:  { side:'top',    f:0/3 },  // top-left corner
  S2:  { side:'top',    f:1/3 },
  S3:  { side:'top',    f:2/3 },
  S4:  { side:'top',    f:3/3 },  // top-right corner
  S5:  { side:'right',  f:0/2 },
  S6:  { side:'right',  f:1/2 },
  S7:  { side:'right',  f:2/2 },
  S8:  { side:'bottom', f:3/3 },  // bottom-right corner
  S9:  { side:'bottom', f:2/3 },
  S10: { side:'bottom', f:1/3 },
  S11: { side:'bottom', f:0/3 }, // bottom-left corner
  S12: { side:'left',   f:2/2 },
  S13: { side:'left',   f:1/2 },
  S14: { side:'left',   f:0/2 },
};

// ─── Build heatmap grid from active sensors ───────────────────────────────────
// Returns Float32Array[ROWS][COLS], values 0.0 – 1.0
//
// ALGORITHM (matches emoji example exactly):
//   1. For each active sensor, compute influence on every cell
//   2. depth   = how many cells from the sensor's edge inward (0 = touching edge)
//   3. lateral = cells along the edge away from sensor anchor
//   4. Heat = depthHeat(depth) × lateralHeat(lateral)
//      depthHeat:   1.0 at edge → 0 at far side (linear, full grid reach)
//      lateralHeat: 1.0 at anchor → spreads ~6 cells wide before fading
//   5. Per cell: take MAX from all sensors
//
// Result for S6 (right-mid):
//   right col  → ~1.0 (RED)
//   col-1      → ~0.72 (ORANGE)
//   col-2      → ~0.50 (YELLOW-ORANGE)
//   col-3/4    → ~0.30 (YELLOW)
//   far left   → ~0.05 (GREEN)
function buildGrid(activeSensors) {
  const grid = Array.from({ length: ROWS }, () => new Float32Array(COLS).fill(0));
  if (activeSensors.length === 0) return grid;

  for (const sid of activeSensors) {
    const meta = SENSOR_META[sid];
    if (!meta) continue;

    const anchorCol = meta.f * (COLS - 1);
    const anchorRow = meta.f * (ROWS - 1);

    // Max depth = full grid dimension (so heat reaches all the way across)
    const maxDepth = meta.side === 'top' || meta.side === 'bottom' ? ROWS - 1 : COLS - 1;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // depth: cells from sensor's wall inward
        let depth;
        if      (meta.side === 'top')    depth = r;
        else if (meta.side === 'bottom') depth = ROWS - 1 - r;
        else if (meta.side === 'left')   depth = c;
        else                              depth = COLS - 1 - c;

        // lateral: cells along the edge from anchor
        const lateral = (meta.side === 'top' || meta.side === 'bottom')
          ? Math.abs(c - anchorCol)
          : Math.abs(r - anchorRow);

        // Depth heat: linear fade from 1.0 at edge → 0 at opposite wall
        // Power of 1.6 makes the red zone sharp and yellow/green zone wide
        const depthHeat = Math.pow(1 - depth / maxDepth, 1.6);

        // Lateral heat: Gaussian spread, sigma ~4 cells
        // Ensures sensor affects a realistic cone, not just one column
        const sigma = 4.5;
        const lateralHeat = Math.exp(-(lateral * lateral) / (2 * sigma * sigma));

        const inf = depthHeat * lateralHeat;

        if (inf > grid[r][c]) grid[r][c] = inf;
      }
    }
  }
  return grid;
}


// ─── Cell color from 0-1 heat value ──────────────────────────────────────────
// Matches emoji example:
//   v ≥ 0.72  →  🔴 RED       (very close to sensor)
//   v ≥ 0.48  →  🟠 ORANGE    (approaching)
//   v ≥ 0.26  →  🟡 YELLOW    (distant)
//   v ≥ 0.08  →  🟡 pale yellow-green (far)
//   v < 0.08  →  🟢 GREEN     (safe)
function heatColor(v) {
  if (v >= 0.72) return '#C40000';  // 🔴 deep red
  if (v >= 0.55) return '#E02000';  // 🔴 red
  if (v >= 0.42) return '#D05800';  // 🟠 red-orange
  if (v >= 0.30) return '#C07800';  // 🟠 orange
  if (v >= 0.20) return '#A08800';  // 🟡 dark yellow
  if (v >= 0.10) return '#6B7A20';  // 🟡 yellow-green
  if (v >= 0.04) return '#2E5A22';  // 🟢 light green
  return '#1A3D20';                  // 🟢 safe dark green
}

// ─── Single pixel cell ────────────────────────────────────────────────────────
const Cell = React.memo(({ v }) => (
  <div style={{
    background: heatColor(v),
    borderRight:  '1px solid rgba(0,0,0,0.12)',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    transition: 'background 0.45s ease',
    animation: v >= 0.72 ? 'cellPulse 0.65s ease-in-out infinite alternate' : 'none',
  }} />
));

// ─── Sensor button ────────────────────────────────────────────────────────────
function SensorBtn({ id, active, onClick }) {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        width: '100%', height: '100%',
        borderRadius: 12,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'monospace',
        fontWeight: 700,
        fontSize: 13,
        position: 'relative',
        transition: 'all 0.3s ease',
        // ON = red glow, OFF = dark green
        background: active
          ? 'rgba(160, 0, 0, 0.88)'
          : 'rgba(22, 52, 28, 0.85)',
        border: active
          ? '2px solid #D32F2F'
          : '2px solid rgba(56, 110, 60, 0.45)',
        color: active ? '#FFCDD2' : '#4CAF50',
        boxShadow: active
          ? '0 0 18px rgba(239,83,80,0.7)'
          : 'none',
        animation: active ? 'sensorOn 0.5s ease-in-out infinite alternate' : 'none',
      }}>
      {active && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          width: 9, height: 9, borderRadius: '50%',
          background: '#FF1744',
          border: '2px solid #0D1210',
          animation: 'dotBlink 0.6s linear infinite',
        }} />
      )}
      <span style={{ fontSize: 12, letterSpacing: '0.04em' }}>{id}</span>
      <span style={{ fontSize: 8, marginTop: 2, opacity: 0.7 }}>
        {active ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}

// ─── Main HeatMap ─────────────────────────────────────────────────────────────
export default function HeatMap() {
  const [active, setActive] = useState(new Set());
  const [mode, setMode] = useState('manual'); // 'manual' | 'backend'
  const [fbConnected, setFbConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fbUnsubRef = useRef(null);

  const toggleSensor = useCallback((id) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Firebase backend mode
  useEffect(() => {
    if (mode !== 'backend') { fbUnsubRef.current?.(); setFbConnected(false); return; }
    let dead = false;
    import('../services/firebase.js').then(({ database, ref, onValue, off }) => {
      if (dead) return;
      const dbRef = ref(database, 'sensors');
      const handler = onValue(dbRef, snap => {
        const data = snap.val() || {};
        const nowActive = new Set();
        for (const [k, v] of Object.entries(data)) {
          const dist = typeof v === 'object' ? (v.distance ?? v.value ?? 999) : Number(v);
          if (dist < 80) nowActive.add(k);
        }
        setActive(nowActive);
        setLastUpdated(new Date());
        setFbConnected(true);
      }, () => setFbConnected(false));
      fbUnsubRef.current = () => off(dbRef, 'value', handler);
    }).catch(() => {});
    return () => { dead = true; fbUnsubRef.current?.(); };
  }, [mode]);

  const activeSensors = useMemo(() => [...active], [active]);
  const grid = useMemo(() => buildGrid(activeSensors), [activeSensors]);
  const hasAlert = activeSensors.length > 0;

  // Layout constants
  const GAP = 6;   // px gap between cells
  const SW  = 58;  // sensor button width & height

  // Group layout matching reference image exactly
  // Row1: S1(corner) S2 S3 S4(corner) — 4 equal cols spanning full width
  // Middle left col: S14, S13, S12 (top→bottom)
  // Middle right col: S5, S6, S7 (top→bottom)
  // Row5: S11(corner) S10 S9 S8(corner) — 4 equal cols

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, color: '#E8F5E9', margin: 0 }}>
            Farm Heatmap
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 6px #4CAF50', display: 'inline-block', animation: 'dotBlink 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#81C784' }}>LIVE</span>
            <span style={{ fontSize: 11, color: '#3D5C41' }}>
              · {lastUpdated?.toLocaleTimeString() || '--:--:--'}
            </span>
          </div>
        </div>

        {/* LIVE / HISTORY + mode */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(129,199,132,0.2)' }}>
            <div style={{ padding: '7px 18px', background: '#2E7D32', color: '#E8F5E9', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A5D6A7', animation: 'dotBlink 1.5s infinite' }} />
              LIVE
            </div>
            <div style={{ padding: '7px 18px', background: 'rgba(27,45,30,0.7)', color: '#3D5C41', fontSize: 12, fontWeight: 700 }}>
              HISTORY
            </div>
          </div>

          {/* Manual / Backend toggle */}
          <button
            onClick={() => setMode(m => m === 'manual' ? 'backend' : 'manual')}
            style={{
              padding: '7px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              background: mode === 'backend' ? 'rgba(46,125,50,0.85)' : 'rgba(27,35,30,0.8)',
              border: `1px solid ${mode === 'backend' ? '#4CAF50' : 'rgba(129,199,132,0.2)'}`,
              color: mode === 'backend' ? '#E8F5E9' : '#5F6B63',
              transition: 'all 0.2s',
            }}>
            <Radio size={12} />
            {mode === 'backend'
              ? (fbConnected ? '📡 Backend LIVE' : '📡 Connecting...')
              : '🎛️ Manual'}
          </button>
        </div>
      </div>

      {/* ── Alert banner ── */}
      {hasAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
          borderRadius: 12, marginBottom: 12,
          background: 'rgba(160,0,0,0.18)', border: '2px solid rgba(239,83,80,0.5)',
          animation: 'alarmPulse 1s ease-in-out infinite',
        }}>
          <AlertTriangle size={16} style={{ color: '#EF5350', flexShrink: 0, animation: 'dotBlink 0.5s linear infinite' }} />
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, color: '#EF5350', flex: 1 }}>
            ⚠ ELEPHANT DETECTED — Active: {activeSensors.join(' · ')}
          </div>
        </div>
      )}

      {/* ── Mode hint ── */}
      {mode === 'manual' && (
        <div style={{ fontSize: 11, color: '#3D5C41', marginBottom: 10, padding: '6px 10px', borderRadius: 8, background: 'rgba(27,35,30,0.5)', border: '1px solid rgba(129,199,132,0.08)' }}>
          💡 Sensor button eka click karanna — on/off wenawa. Cultivation area eke cells real-time color wenawa.
        </div>
      )}

      {/* ── Heatmap card ── */}
      <div style={{ background: 'rgba(10,16,12,0.97)', borderRadius: 20, padding: 14, border: '1px solid rgba(129,199,132,0.1)', marginBottom: 12 }}>

        {/*
          LAYOUT (exactly like reference image):

          ┌───────────────────────────────────────────────┐
          │  [S1]     [S2]     [S3]     [S4]              │
          │  [S14] ┌─────────────────────┐ [S5]           │
          │  [S13] │  20×20 pixel grid   │ [S6]           │
          │  [S12] └─────────────────────┘ [S7]           │
          │  [S11]    [S10]    [S9]    [S8]               │
          └───────────────────────────────────────────────┘
        */}

        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: GAP }}>

          {/* ROW 1: S1 S2 S3 S4 — full width 4 cols, corners = SW wide */}
          <div style={{ display: 'grid', gridTemplateColumns: `${SW}px 1fr 1fr ${SW}px`, gap: GAP, height: SW }}>
            {['S1','S2','S3','S4'].map(id => <SensorBtn key={id} id={id} active={active.has(id)} onClick={toggleSensor} />)}
          </div>

          {/* MIDDLE: [left sensors] [GRID] [right sensors] */}
          <div style={{ display: 'grid', gridTemplateColumns: `${SW}px 1fr ${SW}px`, gap: GAP }}>

            {/* LEFT: S14 S13 S12 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
              {['S14','S13','S12'].map(id => (
                <div key={id} style={{ height: SW }}><SensorBtn id={id} active={active.has(id)} onClick={toggleSensor} /></div>
              ))}
            </div>

            {/* ═══ PIXEL GRID ═══ */}
            <div style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              border: `2px solid ${hasAlert ? 'rgba(239,83,80,0.3)' : 'rgba(46,100,50,0.3)'}`,
              transition: 'border-color 0.5s',
              height: 3 * SW + 2 * GAP,
            }}>
              {/* The cells */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'grid',
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              }}>
                {grid.map((row, r) =>
                  row.map((v, c) => <Cell key={`${r}-${c}`} v={v} />)
                )}
              </div>

              {/* Scanline overlay for realism */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
              }} />

              {/* Watermark when all safe */}
              {!hasAlert && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.2 }}>
                  <div style={{ fontSize: 30 }}>🌾</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 600, color: '#4CAF50', marginTop: 4, letterSpacing: '0.12em' }}>CULTIVATION AREA</div>
                </div>
              )}
            </div>

            {/* RIGHT: S5 S6 S7 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
              {['S5','S6','S7'].map(id => (
                <div key={id} style={{ height: SW }}><SensorBtn id={id} active={active.has(id)} onClick={toggleSensor} /></div>
              ))}
            </div>
          </div>

          {/* ROW 5: S11 S10 S9 S8 */}
          <div style={{ display: 'grid', gridTemplateColumns: `${SW}px 1fr 1fr ${SW}px`, gap: GAP, height: SW }}>
            {['S11','S10','S9','S8'].map(id => <SensorBtn key={id} id={id} active={active.has(id)} onClick={toggleSensor} />)}
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(18,28,20,0.9)', border: '1px solid rgba(129,199,132,0.07)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#E8F5E9', marginBottom: 8 }}>Legend</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {[
              { color: '#EF5350', bg: 'rgba(139,0,0,0.9)',    label: 'HIGH',  sub: 'Very close'  },
              { color: '#FF8F00', bg: 'rgba(154,56,0,0.9)',   label: 'MED',   sub: 'Approaching' },
              { color: '#F9A825', bg: 'rgba(122,88,0,0.9)',   label: 'LOW',   sub: 'Distant'     },
              { color: '#4CAF50', bg: '#1A3D20',              label: 'SAFE',  sub: 'No activity' },
            ].map(({ color, bg, label, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, background: bg, border: `2px solid ${color}` }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color }}>{label}</div>
                  <div style={{ fontSize: 9, color: '#3D5C41' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick toggle strip ── */}
      <div style={{ padding: '10px 12px', borderRadius: 14, background: 'rgba(27,35,30,0.65)', border: '1px solid rgba(129,199,132,0.1)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#3D5C41', letterSpacing: '0.1em', marginBottom: 8 }}>QUICK CONTROLS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {Object.keys(SENSOR_META).map(id => {
            const on = active.has(id);
            return (
              <button key={id} onClick={() => toggleSensor(id)} style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'monospace',
                transition: 'all 0.2s',
                background: on ? 'rgba(180,0,0,0.8)' : 'rgba(22,40,26,0.8)',
                border: `1px solid ${on ? '#D32F2F' : 'rgba(56,110,60,0.35)'}`,
                color: on ? '#FFCDD2' : '#5F6B63',
                boxShadow: on ? '0 0 8px rgba(239,83,80,0.4)' : 'none',
              }}>
                {id}
              </button>
            );
          })}
          <button onClick={() => setActive(new Set())} style={{
            padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer', marginLeft: 4,
            background: 'rgba(27,35,30,0.8)', border: '1px solid rgba(129,199,132,0.15)', color: '#4A5C4E',
          }}>
            Clear All
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dotBlink   { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes sensorOn   { from{box-shadow:0 0 8px rgba(239,83,80,0.5)} to{box-shadow:0 0 20px rgba(239,83,80,0.95)} }
        @keyframes alarmPulse { 0%,100%{border-color:rgba(239,83,80,0.3)} 50%{border-color:rgba(239,83,80,0.9)} }
        @keyframes cellPulse  { from{background:#8B0000} to{background:#FF1010;box-shadow:inset 0 0 4px rgba(255,50,50,0.6)} }
      `}</style>
    </div>
  );
}
