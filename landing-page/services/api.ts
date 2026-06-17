import { UserCredentials } from "@/types";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.BASE_API_URL!;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      // Use standard headers assignment compatible with newer Axios setups
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const loginUser = (credentials: UserCredentials) =>
  api.post("/auth/v1/login", credentials);

// Sensor data
export const getActiveSensors = () => api.get("/sensors/active");
export const getSensorHistory = (params: Record<string, unknown>) =>
  api.get("/sensors/history", { params });

// AI Prediction
export const getPrediction = (data: unknown) => api.post("/prediction", data);

// Farm Info
export const submitFarmInfo = (data: unknown) =>
  api.post("/api/user/farm-info", data);
export const getFarmInfo = () => api.get("/api/user/farm-info");
export const updateFarmInfo = (data: unknown) =>
  api.put("/api/user/farm-info", data);

// Mock data for development (when backend unavailable)
export const mockSensorData = () => ({
  data: {
    activeSensors: [],
  },
});

export const mockPrediction = (data: unknown) => ({
  data: {
    threat: Math.random() > 0.4,
    probability: Math.floor(Math.random() * 60) + 30,
    message: "Prediction based on historical movement patterns",
  },
});

export const mockHistory = () => ({
  data: {
    items: [
      {
        id: 1,
        sensorId: "S1",
        status: "HIGH",
        timestamp: "2026-05-16T14:23:00",
        duration: "12 min",
      },
      {
        id: 2,
        sensorId: "S2",
        status: "MEDIUM",
        timestamp: "2026-05-16T13:10:00",
        duration: "8 min",
      },
      {
        id: 3,
        sensorId: "S15",
        status: "HIGH",
        timestamp: "2026-05-15T20:45:00",
        duration: "25 min",
      },
      {
        id: 4,
        sensorId: "S16",
        status: "LOW",
        timestamp: "2026-05-15T19:30:00",
        duration: "5 min",
      },
      {
        id: 5,
        sensorId: "S8",
        status: "CRITICAL",
        timestamp: "2026-05-14T22:15:00",
        duration: "35 min",
      },
      {
        id: 6,
        sensorId: "S9",
        status: "MEDIUM",
        timestamp: "2026-05-14T21:00:00",
        duration: "18 min",
      },
      {
        id: 7,
        sensorId: "S3",
        status: "LOW",
        timestamp: "2026-05-13T16:30:00",
        duration: "3 min",
      },
      {
        id: 8,
        sensorId: "S14",
        status: "HIGH",
        timestamp: "2026-05-12T23:50:00",
        duration: "42 min",
      },
    ],
    total: 8,
    page: 1,
    perPage: 10,
  },
});

export default api;
