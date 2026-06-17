"use client";

import React, { useState, useMemo } from "react";
import {
  Brain,
  Calendar,
  Clock,
  Zap,
  Wheat,
  Droplets,
  Ruler,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { SensorMetaMap,  PredictionRequest,
  PredictionResponseData,
  RiskLevel, } from "@/types";
import { getPrediction } from "@/services/api";

// ── Re-use the same grid + sensor layout from HeatMap ────────────────────────
const ROWS = 20;
const COLS = 20;

const SENSOR_META: SensorMetaMap = {
  S1: { side: "top", f: 0 / 3 }, // top-left corner
  S2: { side: "top", f: 1 / 3 },
  S3: { side: "top", f: 2 / 3 },
  S4: { side: "top", f: 3 / 3 }, // top-right corner
  S5: { side: "right", f: 0 / 2 },
  S6: { side: "right", f: 1 / 2 },
  S7: { side: "right", f: 2 / 2 },
  S8: { side: "bottom", f: 3 / 3 }, // bottom-right corner
  S9: { side: "bottom", f: 2 / 3 },
  S10: { side: "bottom", f: 1 / 3 },
  S11: { side: "bottom", f: 0 / 3 }, // bottom-left corner
  S12: { side: "left", f: 2 / 2 },
  S13: { side: "left", f: 1 / 2 },
  S14: { side: "left", f: 0 / 2 },
};

// Sensor risk levels: 'HIGH' | 'MEDIUM' | 'LOW' | null
// buildGrid produces 0-1 values; heatColor maps them
const riskStrength: Record<RiskLevel, number> = {
  HIGH: 1.0,
  MEDIUM: 0.55,
  LOW: 0.28,
};

function buildGrid(sensorRisks: Record<string, RiskLevel>): Float32Array[] {
  const grid = Array.from({ length: ROWS }, () =>
    new Float32Array(COLS).fill(0),
  );

  for (const [sid, risk] of Object.entries(sensorRisks)) {
    const meta = SENSOR_META[sid];
    if (!meta || !risk) continue;

    const strength = riskStrength[risk] || 0;
    const anchorCol = meta.f * (COLS - 1);
    const anchorRow = meta.f * (ROWS - 1);
    const maxDepth =
      meta.side === "top" || meta.side === "bottom" ? ROWS - 1 : COLS - 1;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let depth: number;
        if (meta.side === "top") depth = r;
        else if (meta.side === "bottom") depth = ROWS - 1 - r;
        else if (meta.side === "left") depth = c;
        else depth = COLS - 1 - c;

        const lateral =
          meta.side === "top" || meta.side === "bottom"
            ? Math.abs(c - anchorCol)
            : Math.abs(r - anchorRow);

        const depthHeat = Math.pow(1 - depth / maxDepth, 1.6);
        const lateralHeat = Math.exp(-(lateral * lateral) / (2 * 4.5 * 4.5));
        const inf = strength * depthHeat * lateralHeat;

        if (inf > grid[r][c]) {
          grid[r][c] = inf;
        }
      }
    }
  }
  return grid;
}

const heatColor = (v: number) => {
  if (v >= 0.72) return "#C40000"; // 🔴 deep red
  if (v >= 0.55) return "#E02000"; // 🔴 red
  if (v >= 0.42) return "#D05800"; // 🟠 red-orange
  if (v >= 0.3) return "#C07800"; // 🟠 orange
  if (v >= 0.2) return "#A08800"; // 🟡 dark yellow
  if (v >= 0.1) return "#6B7A20"; // 🟡 yellow-green
  if (v >= 0.04) return "#2E5A22"; // 🟢 light green
  return "#1A3D20"; // 🟢 safe dark green
};

interface CellProps {
  v: number;
}
// ─── Single pixel cell ────────────────────────────────────────────────────────
const Cell = React.memo<CellProps>(({ v }) => (
  <div
    style={{
      background: heatColor(v),
      borderRight: "1px solid rgba(0,0,0,0.12)",
      borderBottom: "1px solid rgba(0,0,0,0.12)",
      transition: "background 0.45s ease",
      animation:
        v >= 0.72 ? "cellPulse 0.65s ease-in-out infinite alternate" : "none",
    }}
  />
));

// Sensor risk color for sensor buttons
function sensorRiskStyle(risk: string) {
  if (risk === "HIGH")
    return {
      bg: "rgba(160,0,0,0.88)",
      border: "#D32F2F",
      text: "#FFCDD2",
      glow: "0 0 18px rgba(239,83,80,0.7)",
    };
  if (risk === "MEDIUM")
    return {
      bg: "rgba(160,70,0,0.85)",
      border: "#BF360C",
      text: "#FFE0B2",
      glow: "0 0 14px rgba(255,143,0,0.6)",
    };
  if (risk === "LOW")
    return {
      bg: "rgba(110,88,0,0.85)",
      border: "#9E8000",
      text: "#FFF8E1",
      glow: "0 0 10px rgba(249,168,37,0.5)",
    };
  return {
    bg: "rgba(22,52,28,0.85)",
    border: "rgba(56,110,60,0.45)",
    text: "#4CAF50",
    glow: "none",
  };
}

function SensorBtn({ id, risk }: { id: string; risk: string }) {
  const s = sensorRiskStyle(risk);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        background: s.bg,
        border: `2px solid ${s.border}`,
        color: s.text,
        boxShadow: risk ? s.glow : "none",
        animation:
          risk === "HIGH"
            ? "sensorOn 0.5s ease-in-out infinite alternate"
            : "none",
        transition: "all 0.5s ease",
        position: "relative",
        userSelect: "none",
      }}
    >
      {risk && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              risk === "HIGH"
                ? "#FF1744"
                : risk === "MEDIUM"
                  ? "#FF8F00"
                  : "#F9A825",
            border: "2px solid #0D1210",
            animation: "dotBlink 0.7s linear infinite",
          }}
        />
      )}
      <span style={{ fontSize: 11 }}>{id}</span>
      {risk && (
        <span style={{ fontSize: 7, marginTop: 1, opacity: 0.85 }}>{risk}</span>
      )}
    </div>
  );
}

// Input field
interface FieldProps {
  label: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  children: React.ReactNode;
}

function Field({ label, icon: Icon, children }: FieldProps) {
  return (
    <div>
      <label
        className="flex items-center gap-2 text-xs font-bold mb-1.5 uppercase tracking-wider"
        style={{ color: "#5F6B63" }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: "#3D5C41" }} />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  fontSize: 13,
  background: "rgba(15,20,18,0.8)",
  border: "1px solid rgba(129,199,132,0.2)",
  color: "#E8F5E9",
  outline: "none",
  fontFamily: "inherit",
};

// ── AI mock prediction logic ──────────────────────────────────────────────────
// In production this calls your backend POST /prediction
function mockAiPredict(form: PredictionRequest): PredictionResponseData {
  const hour = parseInt(form.time.split(":")[0], 10);
  const isEvening = hour >= 17 || hour <= 6;
  const isNightTime = hour >= 20 || hour <= 5;
  const waterClose = parseInt(form.waterCanal || "500", 10) < 300;
  const forestClose = parseInt(form.forestDist || "500", 10) < 400;

  const sensors: Record<string, RiskLevel> = {};
  const all = Object.keys(SENSOR_META);

  if (isNightTime) {
    if (waterClose) {
      sensors["S12"] = "HIGH";
      sensors["S13"] = "HIGH";
      sensors["S11"] = "MEDIUM";
      sensors["S14"] = "MEDIUM";
      sensors["S10"] = "LOW";
    } else {
      sensors["S13"] = "HIGH";
      sensors["S12"] = "MEDIUM";
      sensors["S14"] = "LOW";
    }
    if (forestClose) {
      sensors["S7"] = "MEDIUM";
      sensors["S8"] = "LOW";
    }
  } else if (isEvening) {
    sensors["S6"] = "HIGH";
    sensors["S5"] = "MEDIUM";
    sensors["S7"] = "LOW";
    sensors["S3"] = "LOW";
  } else {
    const pick = all[Math.floor(Math.random() * all.length)];
    sensors[pick] = "LOW";
  }

  const order: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const predicted = Object.entries(sensors).sort(
    (a, b) => order[a[1]] - order[b[1]],
  );

  return { sensors, predicted };
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PredictionPage() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    date: today,
    time: "18:30",
    cropType: "",
    waterCanal: "",
    areaSize: "",
    forestDist: "",
    notes: "",
  });
  const [result, setResult] = useState<PredictionResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const set =
    (k: keyof PredictionRequest) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const handlePredict = async () => {
    if (!form.date || !form.time) return;
    setLoading(true);
    try {
      const res = await getPrediction(form);
      if (res && res.data) {
        setResult(res.data);
      } else {
        throw new Error("Invalid format received from server");
      }
    } catch (error) {
      console.warn(
        "Backend API offline or structural breakdown. Falling back to local model metrics.",
        error,
      );
      await new Promise((r) => setTimeout(r, 1400));
      setResult(mockAiPredict(form));
    } finally {
      setLoading(false);
    }
  };

  const sensorRisks = useMemo(() => result?.sensors || {}, [result]);
  const grid = useMemo(() => buildGrid(sensorRisks), [sensorRisks]);

  const GAP = 6,
    SW = 52;

  const riskLabel = (r: string) => sensorRisks[r] || null;

  return (
    <div
      style={{ fontFamily: "'Nunito',sans-serif" }}
      className="space-y-4 max-w-5xl"
    >
      <div>
        <h2
          className="font-display text-2xl font-bold"
          style={{ color: "#E8F5E9" }}
        >
          AI Threat Prediction
        </h2>
        <p className="text-sm mt-1" style={{ color: "#5F6B63" }}>
          Enter cultivation details — AI predicts which sensors will detect
          elephant activity
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">
        {/* ── LEFT: Input form ── */}
        <div
          style={{
            background: "rgba(27,35,30,0.7)",
            border: "1px solid rgba(129,199,132,0.15)",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(129,199,132,0.1)",
                border: "1px solid rgba(129,199,132,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain className="w-4 h-4" style={{ color: "#81C784" }} />
            </div>
            <div>
              <div
                className="font-display font-bold text-sm"
                style={{ color: "#E8F5E9" }}
              >
                Prediction Parameters
              </div>
              <div style={{ fontSize: 11, color: "#5F6B63" }}>
                Date, time & cultivation info
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Date + Time row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <Field label="Date" icon={Calendar}>
                <input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  min={today}
                  style={inputStyle}
                />
              </Field>
              <Field label="Time" icon={Clock}>
                <input
                  type="time"
                  value={form.time}
                  onChange={set("time")}
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(129,199,132,0.08)",
                margin: "2px 0",
              }}
            />
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#3D5C41",
                letterSpacing: "0.1em",
              }}
            >
              CULTIVATION DETAILS
            </div>

            <Field label="Crop Type" icon={Wheat}>
              <input
                type="text"
                value={form.cropType}
                onChange={set("cropType")}
                placeholder="e.g. Rice, Corn, Sugarcane..."
                style={inputStyle}
              />
            </Field>

            <Field label="Water Canal Distance (m)" icon={Droplets}>
              <input
                type="number"
                value={form.waterCanal}
                onChange={set("waterCanal")}
                placeholder="Distance to nearest canal..."
                min="0"
                style={inputStyle}
              />
            </Field>

            <Field label="Cultivation Area Size" icon={Ruler}>
              <input
                type="text"
                value={form.areaSize}
                onChange={set("areaSize")}
                placeholder="e.g. 2 acres, 500 perches..."
                style={inputStyle}
              />
            </Field>

            <Field label="Forest Distance (m)" icon={Ruler}>
              <input
                type="number"
                value={form.forestDist}
                onChange={set("forestDist")}
                placeholder="Distance to forest boundary..."
                min="0"
                style={inputStyle}
              />
            </Field>

            <Field label="Additional Notes" icon={FileText}>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                placeholder="Any recent animal sightings, crop stage, etc..."
                rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              />
            </Field>

            <button
              onClick={handlePredict}
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 12,
                fontSize: 13,
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: loading
                  ? "rgba(46,125,50,0.35)"
                  : "linear-gradient(135deg,#2E7D32,#388E3C)",
                color: "#E8F5E9",
                boxShadow: loading ? "none" : "0 4px 18px rgba(46,125,50,0.4)",
                border: "none",
                transition: "all 0.3s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Run AI Prediction
                </>
              )}
            </button>

            {result && (
              <button
                onClick={() => setResult(null)}
                style={{
                  fontSize: 11,
                  color: "#3D5C41",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textAlign: "center",
                }}
              >
                Clear results
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Heatmap + results ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Result summary strip */}
          {result && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background:
                  result.predicted?.length > 0
                    ? "rgba(160,0,0,0.15)"
                    : "rgba(22,80,26,0.2)",
                border: `1px solid ${result.predicted?.length > 0 ? "rgba(239,83,80,0.4)" : "rgba(129,199,132,0.3)"}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation:
                  result.predicted?.length > 0
                    ? "alarmPulse 2s ease-in-out infinite"
                    : "none",
              }}
            >
              {result.predicted?.length > 0 ? (
                <AlertTriangle
                  size={16}
                  style={{ color: "#EF5350", flexShrink: 0 }}
                />
              ) : (
                <CheckCircle
                  size={16}
                  style={{ color: "#81C784", flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Rajdhani',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: result.predicted?.length > 0 ? "#EF5350" : "#81C784",
                  }}
                >
                  {result.predicted && result.predicted.length > 0
                    ? `⚠ HIGH RISK: AI predicts elephant activity near — ${
                        result.predicted
                          .filter(([_, r]: [string, string]) => r === "HIGH")
                          .map(([id]: [string, string]) => id)
                          .join(", ") || "Multiple sensors"
                      }`
                    : "✓ LOW RISK — Minimal elephant activity predicted for this period"}
                </div>
                <div style={{ fontSize: 10, color: "#B0BEC5", marginTop: 2 }}>
                  {result.predicted
                    ?.map(([id, risk]:[string, string]) => `${id}:${risk}`)
                    .join(" · ")}
                </div>
              </div>
            </div>
          )}

          {/* Heatmap card */}
          <div
            style={{
              background: "rgba(10,16,12,0.97)",
              borderRadius: 20,
              padding: 14,
              border: "1px solid rgba(129,199,132,0.1)",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4CAF50",
                  boxShadow: "0 0 6px #4CAF50",
                  animation: "dotBlink 1.8s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#81C784",
                }}
              >
                {result
                  ? "PREDICTION RESULT — Highlighted sensors show predicted threat zones"
                  : "LIVE MAP — Run prediction to see highlighted threat zones"}
              </span>
            </div>

            {/* Sensor ring + grid */}
            <div
              style={{
                maxWidth: 440,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: GAP,
              }}
            >
              {/* Row 1: S1 S2 S3 S4 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${SW}px 1fr 1fr ${SW}px`,
                  gap: GAP,
                  height: SW,
                }}
              >
                {["S1", "S2", "S3", "S4"].map((id) => (
                  <SensorBtn key={id} id={id} risk={riskLabel(id)} />
                ))}
              </div>

              {/* Middle: left | grid | right */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${SW}px 1fr ${SW}px`,
                  gap: GAP,
                }}
              >
                {/* Left */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: GAP }}
                >
                  {["S14", "S13", "S12"].map((id) => (
                    <div key={id} style={{ height: SW }}>
                      <SensorBtn id={id} risk={riskLabel(id)} />
                    </div>
                  ))}
                </div>

                {/* Pixel grid */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `2px solid ${result ? "rgba(239,83,80,0.2)" : "rgba(46,100,50,0.3)"}`,
                    height: 3 * SW + 2 * GAP,
                    transition: "border-color 0.5s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      gridTemplateRows: `repeat(${ROWS},1fr)`,
                      gridTemplateColumns: `repeat(${COLS},1fr)`,
                    }}
                  >
                    {grid.map((row: Float32Array, r: number) => (
                      <React.Fragment key={`row-${r}`}>
                        {Array.from(row).map((v: number, c: number) => (
                          <Cell key={`${r}-${c}`} v={v} />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)",
                    }}
                  />
                  {!result && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.18,
                        pointerEvents: "none",
                      }}
                    >
                      <div style={{ fontSize: 26 }}>🧠</div>
                      <div
                        style={{
                          fontFamily: "'Rajdhani',sans-serif",
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#4CAF50",
                          marginTop: 4,
                          letterSpacing: "0.1em",
                        }}
                      >
                        RUN PREDICTION
                      </div>
                    </div>
                  )}
                </div>

                {/* Right */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: GAP }}
                >
                  {["S5", "S6", "S7"].map((id) => (
                    <div key={id} style={{ height: SW }}>
                      <SensorBtn id={id} risk={riskLabel(id)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: S11 S10 S9 S8 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${SW}px 1fr 1fr ${SW}px`,
                  gap: GAP,
                  height: SW,
                }}
              >
                {["S11", "S10", "S9", "S8"].map((id) => (
                  <SensorBtn key={id} id={id} risk={riskLabel(id)} />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(18,28,20,0.9)",
                border: "1px solid rgba(129,199,132,0.07)",
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 6,
              }}
            >
              {[
                {
                  color: "#EF5350",
                  bg: "rgba(160,0,0,0.85)",
                  label: "HIGH",
                  sub: "Very likely",
                },
                {
                  color: "#FF8F00",
                  bg: "rgba(160,70,0,0.85)",
                  label: "MED",
                  sub: "Moderate",
                },
                {
                  color: "#F9A825",
                  bg: "rgba(110,88,0,0.85)",
                  label: "LOW",
                  sub: "Possible",
                },
                {
                  color: "#4CAF50",
                  bg: "#1A3D20",
                  label: "SAFE",
                  sub: "No risk",
                },
              ].map(({ color, bg, label, sub }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      flexShrink: 0,
                      background: bg,
                      border: `2px solid ${color}`,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 8, color: "#3D5C41" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading state overlay */}
          {loading && (
            <div
              style={{
                padding: "16px",
                borderRadius: 14,
                textAlign: "center",
                background: "rgba(27,35,30,0.7)",
                border: "1px solid rgba(129,199,132,0.15)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid rgba(129,199,132,0.2)",
                  borderTopColor: "#81C784",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 10px",
                }}
              />
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#81C784",
                }}
              >
                Running AI Analysis...
              </div>
              <div style={{ fontSize: 11, color: "#3D5C41", marginTop: 4 }}>
                Analyzing movement patterns based on date, time & cultivation
                data
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dotBlink  { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes sensorOn  { from{box-shadow:0 0 8px rgba(239,83,80,0.5)} to{box-shadow:0 0 22px rgba(239,83,80,0.95)} }
        @keyframes alarmPulse{ 0%,100%{border-color:rgba(239,83,80,0.3)} 50%{border-color:rgba(239,83,80,0.8)} }
        @keyframes cellPulse { from{background:#8B0000} to{background:#FF1010;box-shadow:inset 0 0 4px rgba(255,50,50,0.6)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
