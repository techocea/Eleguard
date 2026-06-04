import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { FarmInfoProvider } from './hooks/useFarmInfo';
import { ToastContainer } from './components/Toast';
import FarmInfoModal from './components/FarmInfoModal';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import HeatMapPage from './pages/HeatMapPage';
import PredictionPage from './pages/PredictionPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SensorControlsPage from './pages/SensorControlsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1412' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-brand-primary font-display text-lg tracking-widest">LOADING...</p>
      </div>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function DashboardWithOnboarding() {
  return (
    <FarmInfoProvider>
      <FarmInfoModal />
      <DashboardLayout />
    </FarmInfoProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardWithOnboarding />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="heatmap" replace />} />
            <Route path="heatmap" element={<HeatMapPage />} />
            <Route path="sensors" element={<SensorControlsPage />} />
            <Route path="prediction" element={<PredictionPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
