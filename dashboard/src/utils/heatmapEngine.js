/**
 * EleGuard Heatmap Engine v3
 * 
 * Sensor placement (around cultivation boundary):
 *   TOP:    S1(corner) S2 S3 S4(corner)   left→right
 *   RIGHT:  S5 S6 S7                       top→bottom  
 *   BOTTOM: S8(corner) S9 S10 S11(corner) right→left
 *   LEFT:   S12 S13 S14                    bottom→top
 *
 * Cultivation grid: ROWS x COLS small cells
 * Each sensor injects a heat plume from its edge inward.
 */

export const GRID_ROWS = 20;
export const GRID_COLS = 20;

// Sensor definitions: side + fractional position (0=start, 1=end) along that edge
export const SENSORS = {
  S1:  { side:'top',    pos:0,    corner:true  },
  S2:  { side:'top',    pos:1/3              },
  S3:  { side:'top',    pos:2/3              },
  S4:  { side:'top',    pos:1,    corner:true  },
  S5:  { side:'right',  pos:0                },
  S6:  { side:'right',  pos:1/2              },
  S7:  { side:'right',  pos:1                },
  S8:  { side:'bottom', pos:1,    corner:true  },
  S9:  { side:'bottom', pos:2/3              },
  S10: { side:'bottom', pos:1/3              },
  S11: { side:'bottom', pos:0,    corner:true  },
  S12: { side:'left',   pos:1                },
  S13: { side:'left',   pos:1/2              },
  S14: { side:'left',   pos:0                },
};

export const TOP_SENSORS    = ['S1','S2','S3','S4'];
export const RIGHT_SENSORS  = ['S5','S6','S7'];
export const BOTTOM_SENSORS = ['S8','S9','S10','S11'];
export const LEFT_SENSORS   = ['S12','S13','S14'];

// Distance thresholds → threat 0-4
export function distanceToThreat(distance) {
  if (distance === null || distance === undefined) return 0;
  if (distance < 5)  return 4; // CRITICAL
  if (distance < 20) return 3; // HIGH
  if (distance < 50) return 2; // MEDIUM
  if (distance < 80) return 1; // LOW
  return 0;
}

// Boolean active (on/off) → threat level
export function boolToThreat(active) {
  return active ? 3 : 0; // HIGH when manually on
}

export function distanceToLabel(distance) {
  if (distance === null || distance === undefined) return 'SAFE';
  if (distance < 5)  return 'CRITICAL';
  if (distance < 20) return 'HIGH';
  if (distance < 50) return 'MEDIUM';
  if (distance < 80) return 'LOW';
  return 'SAFE';
}

// Sensor anchor: grid row/col at the edge nearest that sensor
function sensorAnchor(sensorId) {
  const s = SENSORS[sensorId];
  const R = GRID_ROWS, C = GRID_COLS;
  if (s.side === 'top')    return { row:0,     col: Math.round(s.pos*(C-1)) };
  if (s.side === 'bottom') return { row:R-1,   col: Math.round(s.pos*(C-1)) };
  if (s.side === 'left')   return { row: Math.round(s.pos*(R-1)), col:0     };
  if (s.side === 'right')  return { row: Math.round(s.pos*(R-1)), col:C-1   };
}

// Exponential decay plume from sensor into cultivation grid
function cellInfluence(row, col, sensorId, threatStrength) {
  if (threatStrength === 0) return 0;
  const anchor = sensorAnchor(sensorId);
  const s = SENSORS[sensorId];

  let depth;
  if      (s.side === 'top')    depth = row;
  else if (s.side === 'bottom') depth = GRID_ROWS-1-row;
  else if (s.side === 'left')   depth = col;
  else                           depth = GRID_COLS-1-col;

  let lateral;
  if (s.side === 'top' || s.side === 'bottom') lateral = Math.abs(col - anchor.col);
  else                                          lateral = Math.abs(row - anchor.row);

  // decay constants per threat level (higher = more spread)
  const depthK   = [0, 0.20, 0.14, 0.09, 0.05][threatStrength];
  const lateralK = [0, 0.50, 0.36, 0.24, 0.15][threatStrength];

  const depthDecay   = Math.exp(-depth   * depthK);
  const lateralDecay = Math.exp(-lateral * lateralK);

  return threatStrength * depthDecay * lateralDecay;
}

/**
 * Build 20x20 heat grid.
 * sensorStates: { S1: { threat: 0-4 }, ... }
 */
export function buildHeatGrid(sensorStates) {
  const grid = Array.from({ length: GRID_ROWS }, () => new Float32Array(GRID_COLS));

  for (const [sensorId, state] of Object.entries(sensorStates)) {
    if (!SENSORS[sensorId]) continue;
    const threat = state.threat || 0;
    if (threat === 0) continue;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const inf = cellInfluence(r, c, sensorId, threat);
        if (inf > grid[r][c]) grid[r][c] = inf;
      }
    }
  }
  return grid;
}

// value 0-4 → color key
export function threatToColorKey(v) {
  if (v >= 3.2) return 'critical';
  if (v >= 2.1) return 'high';
  if (v >= 1.1) return 'medium';
  if (v >= 0.3) return 'low';
  return 'safe';
}

export const CELL_COLORS = {
  safe:     { bg:'#1A3D20', border:'rgba(0,0,0,0.2)', pulse:false },
  low:      { bg:'#7A6000', border:'rgba(0,0,0,0.2)', pulse:false },
  medium:   { bg:'#A84000', border:'rgba(0,0,0,0.2)', pulse:false },
  high:     { bg:'#B80000', border:'rgba(0,0,0,0.2)', pulse:false },
  critical: { bg:'#7A0000', border:'rgba(0,0,0,0.2)', pulse:true  },
};

export const SENSOR_STATUS_STYLES = {
  CRITICAL: { bg:'rgba(120,0,0,0.95)',   border:'#C62828', text:'#FFCDD2', glow:'0 0 22px rgba(255,23,68,0.95)' },
  HIGH:     { bg:'rgba(160,0,0,0.9)',    border:'#D32F2F', text:'#FFEBEE', glow:'0 0 16px rgba(239,83,80,0.8)'  },
  MEDIUM:   { bg:'rgba(160,70,0,0.9)',   border:'#BF360C', text:'#FFE0B2', glow:'0 0 14px rgba(255,143,0,0.7)' },
  LOW:      { bg:'rgba(110,88,0,0.9)',   border:'#9E8000', text:'#FFF8E1', glow:'0 0 12px rgba(249,168,37,0.6)' },
  SAFE:     { bg:'rgba(22,52,28,0.85)',  border:'rgba(56,110,60,0.5)', text:'#A5D6A7', glow:'none' },
};

export function getSensorStyle(label) {
  return SENSOR_STATUS_STYLES[label] || SENSOR_STATUS_STYLES.SAFE;
}

export function overallThreatLevel(sensorStates) {
  let max = 0;
  for (const s of Object.values(sensorStates)) max = Math.max(max, s.threat || 0);
  return max;
}

export function dominantDangerSide(sensorStates) {
  const sides = { top:0, right:0, bottom:0, left:0 };
  for (const [id, state] of Object.entries(sensorStates)) {
    const s = SENSORS[id];
    if (s) sides[s.side] = Math.max(sides[s.side], state.threat || 0);
  }
  const best = Object.entries(sides).sort((a,b)=>b[1]-a[1])[0];
  return best[1] > 0 ? best[0] : null;
}
