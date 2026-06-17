"use client";

import { getFarmInfo, submitFarmInfo, updateFarmInfo } from "@/services/api";
import {  FarmInfoContextType, FarmInfoData } from"@/types"
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface FarmInfoProviderProps {
  children: React.ReactNode;
}

export const FarmInfoContext = createContext<FarmInfoContextType | undefined>(undefined);

export const FarmInfoProvider = ({ children }: FarmInfoProviderProps) => {
  const [farmInfo, setFarmInfo] = useState<FarmInfoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const loadFarmInfo = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getFarmInfo();
      if (res.data && res.data.farmername) {
        setFarmInfo(res.data);
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    } catch {
      // Check localStorage fallback
      const cached = localStorage.getItem('farm_info');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as FarmInfoData;
          setFarmInfo(parsed);
          setShowModal(false);
        } catch {
          setShowModal(true);
        }
      } else {
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadFarmInfo();
    } else {
      setLoading(false);
    }
  }, [loadFarmInfo]);

  const saveFarmInfo = async (data: FarmInfoData): Promise<void> => {
    try {
      await submitFarmInfo(data);
    } catch (error) {
      console.warn("Backend unavailable. Storing farm metrics offline via localStorage.", error);
    }
    localStorage.setItem('farm_info', JSON.stringify(data));
    setFarmInfo(data);
    setShowModal(false);
  };

  const updateFarm = async (data: Partial<FarmInfoData>): Promise<void> => {
    try {
      await updateFarmInfo(data);
    } catch (error) {
      console.warn("Backend unavailable. Updating local storage configuration.", error);
    }
    // Prevent spreading null values using functional updates safely
    const updated = farmInfo ? { ...farmInfo, ...data } : (data as FarmInfoData);
    localStorage.setItem('farm_info', JSON.stringify(updated));
    setFarmInfo(updated);
  };

  const resetFarmInfo = (): void => {
    localStorage.removeItem('farm_info');
    setFarmInfo(null);
    setShowModal(true);
  };

  return (
    <FarmInfoContext.Provider 
      value={{ 
        farmInfo, 
        loading, 
        showModal, 
        saveFarmInfo, 
        updateFarm, 
        resetFarmInfo, 
        loadFarmInfo 
      }}
    >
      {children}
    </FarmInfoContext.Provider>
  );
};


export const useFarmInfo = (): FarmInfoContextType => {
  const ctx = useContext(FarmInfoContext);
  if (!ctx) {
    throw new Error('useFarmInfo must be inside a FarmInfoProvider structure wrapper');
  }
  return ctx;
};