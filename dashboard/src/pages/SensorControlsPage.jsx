import React, { useState, useCallback, useRef } from 'react';
import { ToggleLeft, ToggleRight, AlertTriangle, X, Save, Wheat, Droplets, Ruler, Eye, FileText, ChevronRight } from 'lucide-react';

const SENSOR_META = {
  S1:  { side:'top',    desc:'Top-Left Corner'     }, S2:  { side:'top',    desc:'Top-Center Left'  },
  S3:  { side:'top',    desc:'Top-Center Right'    }, S4:  { side:'top',    desc:'Top-Right Corner' },
  S5:  { side:'right',  desc:'Right-Top'           }, S6:  { side:'right',  desc:'Right-Center'     },
  S7:  { side:'right',  desc:'Right-Bottom'        },
  S8:  { side:'bottom', desc:'Bottom-Right Corner' }, S9:  { side:'bottom', desc:'Bottom-Right'     },
  S10: { side:'bottom', desc:'Bottom-Left'         }, S11: { side:'bottom', desc:'Bottom-Left Corner'},
  S12: { side:'left',   desc:'Left-Bottom'         }, S13: { side:'left',   desc:'Left-Center'      },
  S14: { side:'left',   desc:'Left-Top'            },
};

const GROUPS = [
  { label:'TOP',    ids:['S1','S2','S3','S4'],         color:'#81C784' },
  { label:'RIGHT',  ids:['S5','S6','S7'],              color:'#A5D6A7' },
  { label:'BOTTOM', ids:['S8','S9','S10','S11'],       color:'#81C784' },
  { label:'LEFT',   ids:['S12','S13','S14'],           color:'#A5D6A7' },
];

const EMPTY_FORM = { cropType:'', waterCanal:'', areaSize:'', animalActivity:'none', notes:'' };

// ── Sensor Data Popup ─────────────────────────────────────────────────────────
function SensorPopup({ sensorId, existingData, onSave, onCancel }) {
  const [form, setForm] = useState(existingData || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simulate API call
    onSave(sensorId, { ...form, timestamp: new Date().toISOString() });
    setSaving(false);
  };

  const inputSt = {
    width:'100%', padding:'9px 12px', borderRadius:10, fontSize:12,
    background:'rgba(15,20,18,0.9)', border:'1px solid rgba(129,199,132,0.2)',
    color:'#E8F5E9', outline:'none', fontFamily:'inherit', boxSizing:'border-box',
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onCancel} style={{
        position:'fixed', inset:0, zIndex:50,
        background:'rgba(5,10,7,0.82)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
        animation:'fadeIn 0.25s ease-out',
      }} />

      {/* Modal */}
      <div style={{
        position:'fixed', inset:0, zIndex:51,
        display:'flex', alignItems:'center', justifyContent:'center', padding:16,
      }}>
        <div style={{
          width:'100%', maxWidth:440, borderRadius:24, overflow:'hidden',
          background:'linear-gradient(145deg, rgba(20,32,22,0.99), rgba(12,17,14,0.99))',
          border:'1px solid rgba(129,199,132,0.2)',
          boxShadow:'0 28px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(129,199,132,0.1)',
          animation:'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{ position:'relative', padding:'18px 20px 14px', background:'linear-gradient(135deg,rgba(27,94,32,0.22),transparent)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'24px 24px 0 0',
              background:'linear-gradient(90deg,transparent,#81C784 40%,#A5D6A7 60%,transparent)' }} />

            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#1B5E20,#2E7D32)',
                boxShadow:'0 4px 14px rgba(46,125,50,0.45)', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, flexShrink:0 }}>📡</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:'#E8F5E9' }}>
                  {sensorId} Activation Data
                </div>
                <div style={{ fontSize:11, color:'#5F6B63', marginTop:1 }}>
                  {SENSOR_META[sensorId]?.desc} · {SENSOR_META[sensorId]?.side?.toUpperCase()} boundary
                </div>
              </div>
              <button onClick={onCancel} style={{
                width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(129,199,132,0.15)', color:'#5F6B63',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}><X size={14} /></button>
            </div>

            <div style={{ marginTop:10, padding:'6px 10px', borderRadius:8, background:'rgba(46,125,50,0.12)',
              border:'1px solid rgba(129,199,132,0.12)', fontSize:10, color:'#5F6B63', lineHeight:1.5 }}>
              🔬 This data trains the ML model to predict elephant movement patterns near this sensor location.
            </div>
          </div>

          {/* Form */}
          <div style={{ padding:'0 20px 20px', display:'flex', flexDirection:'column', gap:10, maxHeight:'60vh', overflowY:'auto' }}>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:'#5F6B63', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                <Wheat size={11} style={{ color:'#3D5C41' }} /> CROP TYPE
              </label>
              <input type="text" value={form.cropType} onChange={set('cropType')}
                placeholder="e.g. Rice, Corn, Sugarcane..." style={inputSt}
                onFocus={e=>e.target.style.borderColor='rgba(129,199,132,0.6)'}
                onBlur={e=>e.target.style.borderColor='rgba(129,199,132,0.2)'} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'#5F6B63', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                  <Droplets size={11} style={{ color:'#3D5C41' }} /> WATER CANAL (m)
                </label>
                <input type="number" value={form.waterCanal} onChange={set('waterCanal')}
                  placeholder="Distance..." min="0" style={inputSt}
                  onFocus={e=>e.target.style.borderColor='rgba(129,199,132,0.6)'}
                  onBlur={e=>e.target.style.borderColor='rgba(129,199,132,0.2)'} />
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:'#5F6B63', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                  <Ruler size={11} style={{ color:'#3D5C41' }} /> AREA SIZE
                </label>
                <input type="text" value={form.areaSize} onChange={set('areaSize')}
                  placeholder="e.g. 2 acres..." style={inputSt}
                  onFocus={e=>e.target.style.borderColor='rgba(129,199,132,0.6)'}
                  onBlur={e=>e.target.style.borderColor='rgba(129,199,132,0.2)'} />
              </div>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:'#5F6B63', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                <Eye size={11} style={{ color:'#3D5C41' }} /> ANIMAL ACTIVITY NOTICED?
              </label>
              <select value={form.animalActivity} onChange={set('animalActivity')} style={inputSt}
                onFocus={e=>e.target.style.borderColor='rgba(129,199,132,0.6)'}
                onBlur={e=>e.target.style.borderColor='rgba(129,199,132,0.2)'}>
                <option value="none">None observed</option>
                <option value="tracks">Tracks / footprints seen</option>
                <option value="damage">Crop damage noticed</option>
                <option value="sighting">Direct elephant sighting</option>
                <option value="sounds">Sounds heard at night</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:'#5F6B63', letterSpacing:'0.08em', display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
                <FileText size={11} style={{ color:'#3D5C41' }} /> ADDITIONAL NOTES
              </label>
              <textarea value={form.notes} onChange={set('notes')}
                placeholder="Any other observations relevant to this sensor location..."
                rows={2} style={{ ...inputSt, resize:'vertical', lineHeight:1.5 }}
                onFocus={e=>e.target.style.borderColor='rgba(129,199,132,0.6)'}
                onBlur={e=>e.target.style.borderColor='rgba(129,199,132,0.2)'} />
            </div>

            {/* Save button */}
            <button onClick={handleSave} disabled={saving}
              style={{
                width:'100%', padding:'11px', borderRadius:12, fontSize:13,
                fontFamily:"'Rajdhani',sans-serif", fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em',
                cursor: saving ? 'not-allowed' : 'pointer',
                background: saving ? 'rgba(46,125,50,0.35)' : 'linear-gradient(135deg,#2E7D32,#388E3C)',
                color:'#E8F5E9', border:'none',
                boxShadow: saving ? 'none' : '0 4px 16px rgba(46,125,50,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'all 0.2s', marginTop:2,
              }}>
              {saving
                ? <><span style={{ width:13,height:13,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite' }} />Saving...</>
                : <><Save size={13} /> Save & Activate Sensor</>
              }
            </button>

            <p style={{ textAlign:'center', fontSize:10, color:'#2A3C2C' }}>
              🔒 Data stored securely for ML model training only
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.88) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}

// ── Sensor Card ───────────────────────────────────────────────────────────────
function SensorCard({ id, active, hasData, onToggle }) {
  const meta = SENSOR_META[id];
  return (
    <div
      onClick={() => onToggle(id)}
      style={{
        borderRadius:14, padding:'12px 14px', cursor:'pointer',
        background: active ? 'rgba(140,0,0,0.88)' : 'rgba(22,40,26,0.75)',
        border: `2px solid ${active ? '#D32F2F' : 'rgba(56,110,60,0.35)'}`,
        boxShadow: active ? '0 0 16px rgba(239,83,80,0.65)' : 'none',
        animation: active ? 'sensorOn 0.5s ease-in-out infinite alternate' : 'none',
        transition:'all 0.3s ease', position:'relative', userSelect:'none',
      }}>
      {active && (
        <span style={{
          position:'absolute', top:-4, right:-4, width:10, height:10, borderRadius:'50%',
          background:'#FF1744', border:'2px solid #0D1210', animation:'dotBlink 0.7s linear infinite',
        }} />
      )}
      {hasData && !active && (
        <span style={{
          position:'absolute', top:-4, right:-4, width:9, height:9, borderRadius:'50%',
          background:'#4CAF50', border:'2px solid #0D1210',
        }} title="Data collected" />
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:15,
          color: active ? '#FFCDD2' : '#A5D6A7' }}>{id}</span>
        {active
          ? <ToggleRight size={20} style={{ color:'#D32F2F' }} />
          : <ToggleLeft  size={20} style={{ color:'rgba(56,110,60,0.5)' }} />
        }
      </div>

      <div style={{ fontSize:10, color: active ? 'rgba(255,205,210,0.55)' : '#3D5C41', marginBottom:3 }}>
        {meta.desc}
      </div>
      <div style={{ fontSize:10, fontWeight:700, color: active ? '#EF9A9A' : '#2D3B30' }}>
        {active ? '● ACTIVE' : hasData ? '✓ Data collected' : 'SAFE — Inactive'}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SensorControlsPage() {
  const [activeSet, setActiveSet] = useState(new Set());
  const [popup, setPopup] = useState(null);     // sensorId being configured
  const [sensorData, setSensorData] = useState({}); // { S1: { cropType, ... }, ... }

  const handleToggle = useCallback((id) => {
    const nowActive = !activeSet.has(id);
    if (nowActive) {
      // Turning ON → show popup
      setPopup(id);
    } else {
      // Turning OFF → just deactivate
      setActiveSet(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  }, [activeSet]);

  const handleSave = useCallback((id, formData) => {
    setSensorData(prev => ({ ...prev, [id]: formData }));
    setActiveSet(prev => { const n = new Set(prev); n.add(id); return n; });
    setPopup(null);
  }, []);

  const handleCancelPopup = useCallback(() => {
    setPopup(null);
  }, []);

  const activeSensors = [...activeSet];
  const totalSensors = Object.keys(SENSOR_META).length;

  return (
    <div className="space-y-5 max-w-4xl" style={{ fontFamily:"'Nunito',sans-serif" }}>

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold" style={{ color:'#E8F5E9' }}>Sensor Controls</h2>
        <p className="text-sm mt-1" style={{ color:'#5F6B63' }}>
          Manually activate sensors. When turning ON, you'll be asked to log cultivation data for ML training.
        </p>
      </div>

      {/* Status bar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12,
        background:'rgba(27,35,30,0.7)', border:'1px solid rgba(129,199,132,0.12)', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:8,height:8,borderRadius:'50%',background:'#4CAF50',
            boxShadow:'0 0 6px #4CAF50', animation:'dotBlink 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize:12, fontWeight:700, color:'#81C784' }}>MANUAL CONTROL MODE</span>
        </div>
        <div style={{ fontSize:11, color:'#3D5C41' }}>
          {activeSensors.length} / {totalSensors} active · {Object.keys(sensorData).length} data records collected
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          <button
            onClick={() => { setActiveSet(new Set()); }}
            style={{ padding:'5px 12px', borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer',
              background:'rgba(27,35,30,0.8)', border:'1px solid rgba(129,199,132,0.2)', color:'#5F6B63' }}>
            All OFF
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(22,60,26,0.2)',
        border:'1px solid rgba(129,199,132,0.15)', display:'flex', alignItems:'flex-start', gap:10 }}>
        <ChevronRight size={14} style={{ color:'#4CAF50', flexShrink:0, marginTop:2 }} />
        <div style={{ fontSize:11, color:'#5F6B63', lineHeight:1.6 }}>
          <strong style={{ color:'#81C784' }}>How it works:</strong> Click any sensor card to toggle ON/OFF.
          When activating, a form appears to collect cultivation & environment data for that sensor location.
          This data trains the AI prediction model to improve accuracy.
          <br />
          <span style={{ color:'#3D5C41' }}>Green dot = data already collected · Red dot = sensor active</span>
        </div>
      </div>

      {/* Active alert */}
      {activeSensors.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12,
          background:'rgba(180,20,20,0.15)', border:'2px solid rgba(239,83,80,0.4)',
          animation:'alarmPulse 1s ease-in-out infinite' }}>
          <AlertTriangle size={16} style={{ color:'#EF5350', flexShrink:0, animation:'dotBlink 0.6s linear infinite' }} />
          <div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, color:'#EF5350' }}>
              ACTIVE: {activeSensors.join(' · ')}
            </div>
            <div style={{ fontSize:10, color:'#B0BEC5' }}>
              Sensors recording — visit AI Prediction page to see predicted threat zones
            </div>
          </div>
        </div>
      )}

      {/* Sensor groups */}
      {GROUPS.map(({ label, ids, color }) => (
        <div key={label}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color }}>{label} SENSORS</div>
            <div style={{ flex:1, height:1, background:'rgba(129,199,132,0.1)' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))', gap:8 }}>
            {ids.map(id => (
              <SensorCard
                key={id}
                id={id}
                active={activeSet.has(id)}
                hasData={!!sensorData[id]}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Collected data summary */}
      {Object.keys(sensorData).length > 0 && (
        <div style={{ padding:'14px 16px', borderRadius:16, background:'rgba(27,35,30,0.65)', border:'1px solid rgba(129,199,132,0.1)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#3D5C41', letterSpacing:'0.1em', marginBottom:10 }}>
            COLLECTED ML TRAINING DATA
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {Object.entries(sensorData).map(([id, data]) => (
              <div key={id} style={{
                padding:'5px 10px', borderRadius:8, fontSize:11,
                background:'rgba(15,20,18,0.7)', border:'1px solid rgba(129,199,132,0.15)',
                display:'flex', alignItems:'center', gap:6,
              }}>
                <span style={{ width:6,height:6,borderRadius:'50%',background:'#4CAF50',flexShrink:0 }} />
                <span style={{ fontFamily:'monospace', fontWeight:700, color:'#A5D6A7' }}>{id}</span>
                <span style={{ color:'#3D5C41' }}>{data.cropType || 'No crop specified'}</span>
                <span style={{ color:'#2A3C2C', fontSize:9 }}>{data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup */}
      {popup && (
        <SensorPopup
          sensorId={popup}
          existingData={sensorData[popup] || null}
          onSave={handleSave}
          onCancel={handleCancelPopup}
        />
      )}

      <style>{`
        @keyframes dotBlink  { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes sensorOn  { from{box-shadow:0 0 8px rgba(239,83,80,0.4)} to{box-shadow:0 0 22px rgba(239,83,80,0.9)} }
        @keyframes alarmPulse{ 0%,100%{border-color:rgba(239,83,80,0.3)} 50%{border-color:rgba(239,83,80,0.9)} }
      `}</style>
    </div>
  );
}
