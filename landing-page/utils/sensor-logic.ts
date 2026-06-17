import {
  ActiveSensorInput,
  SensorPositionItem,
  SensorSide,
  SensorStatus,
  UIColorsConfig,
  UIThreatLabel,
} from "@/types";

export const SENSOR_POSITIONS: Record<string, SensorPositionItem> = {
  // TOP sensors (affect top rows of grid)
  S1: { side: "top", index: 0, label: "S1" },
  S2: { side: "top", index: 1, label: "S2" },
  S3: { side: "top", index: 2, label: "S3" },
  S4: { side: "top", index: 3, label: "S4" },
  // RIGHT sensors (affect right columns)
  S5: { side: "right", index: 0, label: "S5" },
  S6: { side: "right", index: 1, label: "S6" },
  S7: { side: "right", index: 2, label: "S7" },
  S8: { side: "right", index: 3, label: "S8" },
  // BOTTOM sensors (affect bottom rows)
  S9: { side: "bottom", index: 3, label: "S9" },
  S10: { side: "bottom", index: 2, label: "S10" },
  S11: { side: "bottom", index: 1, label: "S11" },
  S12: { side: "bottom", index: 0, label: "S12" },
  // LEFT sensors (affect left columns)
  S13: { side: "left", index: 3, label: "S13" },
  S14: { side: "left", index: 2, label: "S14" },
  S15: { side: "left", index: 1, label: "S15" },
  S16: { side: "left", index: 0, label: "S16" },
};

export const THREAT_WEIGHT: Record<SensorStatus, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  SAFE: 0,
};

// Generates a 4x4 grid with threat levels for each cell
export function computeGridThreats(
  activeSensors: ActiveSensorInput[],
): number[][] {
  const grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));

  for (const sensor of activeSensors) {
    const pos = SENSOR_POSITIONS[sensor.sensorId];
    if (!pos) continue;
    const weight = THREAT_WEIGHT[sensor.status] || 0;
    if (weight === 0) continue;

    const { side, index } = pos;

    for (let depth = 0; depth < 4; depth++) {
      const spread = Math.max(0, weight - depth);
      let row = 0,
        col = 0;

      if (side === "top") {
        row = depth;
        col = index;
      } else if (side === "bottom") {
        row = 3 - depth;
        col = index;
      } else if (side === "left") {
        row = index;
        col = depth;
      } else {
        // right
        row = index;
        col = 3 - depth;
      }

      if (row >= 0 && row < 4 && col >= 0 && col < 4) {
        grid[row][col] = Math.max(grid[row][col], spread);
      }
    }

    // Spread laterally for adjacent index sensors
    for (let lateralOffset = -1; lateralOffset <= 1; lateralOffset++) {
      if (lateralOffset === 0) continue;
      for (let depth = 0; depth < 3; depth++) {
        const spread = Math.max(0, weight - depth - 1);
        if (spread === 0) continue;

        let adjIndex = index + lateralOffset;
        if (adjIndex < 0 || adjIndex > 3) continue;

        let row = 0,
          col = 0;
        if (side === "top") {
          row = depth;
          col = adjIndex;
        } else if (side === "bottom") {
          row = 3 - depth;
          col = adjIndex;
        } else if (side === "left") {
          row = adjIndex;
          col = depth;
        } else {
          row = adjIndex;
          col = 3 - depth;
        }

        if (row >= 0 && row < 4 && col >= 0 && col < 4) {
          grid[row][col] = Math.max(grid[row][col], spread);
        }
      }
    }
  }

  return grid;
}

export function threatLevelToColor(level: number): UIThreatLabel {
  if (level >= 4) return "critical";
  if (level >= 3) return "high";
  if (level >= 2) return "medium";
  if (level >= 1) return "low";
  return "safe";
}

export const THREAT_COLORS: Record<UIThreatLabel, UIColorsConfig> = {
  safe: {
    bg: "rgba(27,94,32,0.7)",
    border: "#2E7D32",
    text: "#A5D6A7",
    label: "SAFE",
    dot: "#4CAF50",
  },
  low: {
    bg: "rgba(249,168,37,0.75)",
    border: "#F57F17",
    text: "#fff",
    label: "LOW",
    dot: "#F9A825",
  },
  medium: {
    bg: "rgba(230,81,0,0.8)",
    border: "#BF360C",
    text: "#fff",
    label: "MED",
    dot: "#FF8F00",
  },
  high: {
    bg: "rgba(198,40,40,0.85)",
    border: "#7F0000",
    text: "#fff",
    label: "HIGH",
    dot: "#EF5350",
  },
  critical: {
    bg: "rgba(150,10,10,0.95)",
    border: "#4A0000",
    text: "#fff",
    label: "CRITICAL",
    dot: "#B71C1C",
  },
};

export function getSensorStatusColor(status: SensorStatus): UIColorsConfig {
  switch (status) {
    case "CRITICAL":
      return THREAT_COLORS.critical;
    case "HIGH":
      return THREAT_COLORS.high;
    case "MEDIUM":
      return THREAT_COLORS.medium;
    case "LOW":
      return THREAT_COLORS.low;
    default:
      return THREAT_COLORS.safe;
  }
}

export function getActiveSensorStatus(
  sensorId: string,
  activeSensors: ActiveSensorInput[],
): SensorStatus | null {
  return activeSensors.find((s) => s.sensorId === sensorId)?.status || null;
}

export function detectDangerDirection(
  activeSensors: ActiveSensorInput[],
): SensorSide | null {
  const sides: Record<SensorSide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  for (const s of activeSensors) {
    const pos = SENSOR_POSITIONS[s.sensorId];
    if (pos) sides[pos.side] += THREAT_WEIGHT[s.status] || 0;
  }
  const maxSide = Object.entries(sides).sort((a, b) => b[1] - a[1])[0] as [
    SensorSide,
    number,
  ];
  return maxSide[1] > 0 ? maxSide[0] : null;
}
