import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { getFarmInfo, submitFarmInfo, updateFarmInfo } from "../services/api";

type SensorSide = "top" | "bottom" | "left" | "right";

// 2. Shape of the global lookup dictionary holding perimeter locations
interface SensorMeta {
  side: SensorSide;
  f: number; // Fractional position scale along the wall edge (value between 0.0 and 1.0)
}

// 3. Shape of your global configurations lookup table
type SensorMetaMap = Record<string, SensorMeta>;

// 4. Output grid layout matrix array signature
type HeatmapGrid = Float32Array[];

// The structure of your configuration data form
export interface SensorFormData {
  distance?: string;
  value?: string;
  notes?: string;
  timestamp?: string;
  [key: string]: any; // Fallback for extra dynamic form keys if needed
}

// Global sensor description configuration map shape
export interface SensorMetaItem {
  desc?: string;
  side: "top" | "bottom" | "left" | "right";
  f: number;
}

// ── Props Interfaces ──────────────────────────────────────────────────────────

export interface SensorPopupProps {
  sensorId: string;
  existingData: SensorFormData | null | undefined;
  onSave: (id: string, data: SensorFormData) => void;
  onCancel: () => void;
}

export interface SensorCardProps {
  id: string;
  active: boolean;
  hasData: boolean;
  onToggle: (id: string) => void;
}

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface PredictionRequest {
  date: string;
  time: string;
  cropType: string;
  waterCanal: string;
  areaSize: string;
  forestDist?: string;
  notes: string;
}

export interface PredictionResponseData {
  // e.g., { S6: 'HIGH', S3: 'MEDIUM' }
  sensors: Record<string, RiskLevel>;
  // Sorted array arrays e.g., [['S6', 'HIGH'], ['S3', 'MEDIUM']]
  predicted: [string, RiskLevel][];
}

export interface ApiResponse {
  success: boolean;
  data: PredictionResponseData;
}

export type SensorSide = "top" | "right" | "bottom" | "left";
export type SensorStatus = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
export type UIThreatLabel = "safe" | "low" | "medium" | "high" | "critical";

export interface SensorPositionItem {
  side: SensorSide;
  index: number;
  label: string;
}

export interface ActiveSensorInput {
  sensorId: string;
  status: SensorStatus;
}

export interface HistoricalLogItem {
  id: number;
  sensorId: string;
  status: SensorStatus;
  timestamp: string;
  duration: string;
  [key: string]: any; // Allows optional fields from backend logs
}

export interface UIColorsConfig {
  bg: string;
  border: string;
  text: string;
  label: string;
  dot: string;
}

export interface FormattedTimeObject {
  date: string;
  time: string;
}

export interface HistoricalStats {
  total: number;
  critical: number;
  high: number;
  thisWeek: number;
}

// 1. Structure of the Farm Information state payload
export interface FarmInfoData {
  farmername: string;
  cropType?: string;
  waterCanal?: string;
  areaSize?: string;
  forestDist?: string;
  notes?: string;
  [key: string]: any; // Catch-all for extra dynamic API properties
}

// 2. Methods and variables exposed by your Context Provider hook
export interface FarmInfoContextType {
  farmInfo: FarmInfoData | null;
  loading: boolean;
  showModal: boolean;
  saveFarmInfo: (data: FarmInfoData) => Promise<void>;
  updateFarm: (data: Partial<FarmInfoData>) => Promise<void>;
  resetFarmInfo: () => void;
  loadFarmInfo: () => Promise<void>;
}

// Initialize Context with undefined instead of null to match clean custom hook checks
const FarmInfoContext = createContext<FarmInfoContextType | undefined>(
  undefined,
);

export interface FarmFormState {
  farmername: string;
  water_canal_present: string | number;
  forest_distance_m: string | number;
  harvest_date: string;
}

export type FarmFormErrors = Partial<Record<keyof FarmFormState, string>>;

export interface FormFieldMetadata {
  key: keyof FarmFormState;
  label: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  type: "text" | "number" | "date";
  placeholder?: string;
  unit?: string;
  min?: string;
}

declare const User: FormFieldMetadata["icon"];
declare const Droplets: FormFieldMetadata["icon"];
declare const TreePine: FormFieldMetadata["icon"];
declare const Calendar: FormFieldMetadata["icon"];
declare const toast: {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

export interface UserCredentials {
  username?: string;
  password?: string;
  role?: "USER" | "ADMIN";
}
