import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

let toastCallback = null;

export const toast = {
  success: (msg) => toastCallback?.({ type: 'success', message: msg }),
  error: (msg) => toastCallback?.({ type: 'error', message: msg }),
  warning: (msg) => toastCallback?.({ type: 'warning', message: msg }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastCallback = ({ type, message }) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };
    return () => { toastCallback = null; };
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = {
    success: <CheckCircle className="w-4 h-4" style={{ color: '#81C784' }} />,
    error: <XCircle className="w-4 h-4" style={{ color: '#EF5350' }} />,
    warning: <AlertTriangle className="w-4 h-4" style={{ color: '#FF8F00' }} />,
  };

  const borders = {
    success: 'rgba(129,199,132,0.4)',
    error: 'rgba(239,83,80,0.4)',
    warning: 'rgba(255,143,0,0.4)',
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(({ id, type, message }) => (
        <div key={id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{
            background: 'rgba(15,20,18,0.96)',
            border: `1px solid ${borders[type]}`,
            backdropFilter: 'blur(12px)',
            minWidth: '260px',
            maxWidth: '360px',
            animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
          {icons[type]}
          <span className="flex-1 text-sm" style={{ color: '#E8F5E9' }}>{message}</span>
          <button onClick={() => remove(id)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" style={{ color: '#B0BEC5' }} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
