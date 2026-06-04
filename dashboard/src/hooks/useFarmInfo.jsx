import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFarmInfo, submitFarmInfo, updateFarmInfo } from '../services/api';

const FarmInfoContext = createContext(null);

export const FarmInfoProvider = ({ children }) => {
  const [farmInfo, setFarmInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadFarmInfo = useCallback(async () => {
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
          const parsed = JSON.parse(cached);
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
    if (token) loadFarmInfo();
    else setLoading(false);
  }, [loadFarmInfo]);

  const saveFarmInfo = async (data) => {
    try {
      await submitFarmInfo(data);
    } catch {
      // Backend unavailable — save locally
    }
    localStorage.setItem('farm_info', JSON.stringify(data));
    setFarmInfo(data);
    setShowModal(false);
  };

  const updateFarm = async (data) => {
    try {
      await updateFarmInfo(data);
    } catch {
      // Backend unavailable — update locally
    }
    const updated = { ...farmInfo, ...data };
    localStorage.setItem('farm_info', JSON.stringify(updated));
    setFarmInfo(updated);
  };

  const resetFarmInfo = () => {
    localStorage.removeItem('farm_info');
    setFarmInfo(null);
    setShowModal(true);
  };

  return (
    <FarmInfoContext.Provider value={{ farmInfo, loading, showModal, saveFarmInfo, updateFarm, resetFarmInfo, loadFarmInfo }}>
      {children}
    </FarmInfoContext.Provider>
  );
};

export const useFarmInfo = () => {
  const ctx = useContext(FarmInfoContext);
  if (!ctx) throw new Error('useFarmInfo must be inside FarmInfoProvider');
  return ctx;
};
