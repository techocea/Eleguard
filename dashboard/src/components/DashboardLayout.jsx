import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Map, Brain, History, User, LogOut, Menu, X, Bell,
  Shield, Wifi, Activity, ChevronRight, ToggleRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: 'heatmap',  icon: Map,         label: 'Heat Map',       desc: 'Live sensor monitoring' },
  { to: 'sensors',  icon: ToggleRight, label: 'Sensor Controls', desc: 'Manual sensor on/off' },
  { to: 'prediction', icon: Brain,     label: 'AI Prediction',  desc: 'Threat forecasting' },
  { to: 'history',  icon: History,     label: 'History',        desc: 'Sensor event log' },
  { to: 'profile',  icon: User,        label: 'Profile',        desc: 'Account settings' },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right">
      <div className="font-mono text-xl font-bold" style={{ color: '#81C784' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </div>
      <div className="text-xs" style={{ color: '#5F6B63' }}>
        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1B3A1F, #2E5D30)', border: '1px solid rgba(129,199,132,0.4)' }}>
            <Shield className="w-5 h-5" style={{ color: '#81C784' }} />
          </div>
          <div>
            <div className="font-display font-bold text-base leading-tight" style={{ color: '#E8F5E9' }}>
              Ele<span style={{ color: '#81C784' }}>Guard</span> <span style={{ color: '#A5D6A7', fontSize: '0.75em' }}>LK</span>
            </div>
            <div className="text-xs leading-none" style={{ color: '#3D5C41', letterSpacing: '0.1em' }}>DETECT SYSTEM</div>
          </div>
        </div>

        {/* System status bar */}
        <div className="mt-4 p-3 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(15,20,18,0.6)', border: '1px solid rgba(129,199,132,0.1)' }}>
          <div className="w-2 h-2 rounded-full status-online flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold" style={{ color: '#81C784' }}>SYSTEM ONLINE</div>
            <div className="text-xs" style={{ color: '#4A5C4E' }}>16 sensors active</div>
          </div>
          <Wifi className="w-3 h-3 ml-auto" style={{ color: '#3D5C41' }} />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px" style={{ background: 'rgba(129,199,132,0.1)' }} />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-3 py-2 text-xs font-bold tracking-widest" style={{ color: '#3D5C41' }}>NAVIGATION</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label, desc }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'nav-active' : 'hover:bg-white/5'}`
            }>
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${isActive ? 'bg-green-900/60' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" style={{ color: isActive ? '#81C784' : '#5F6B63' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isActive ? '' : ''}`}
                    style={{ color: isActive ? '#81C784' : '#E8F5E9' }}>
                    {label}
                  </div>
                  <div className="text-xs truncate" style={{ color: '#4A5C4E' }}>{desc}</div>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#81C784' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user + logout */}
      <div className="p-4 pt-0">
        <div className="mx-0 h-px mb-4" style={{ background: 'rgba(129,199,132,0.1)' }} />
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#E8F5E9' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: '#E8F5E9' }}>{user?.name || 'User'}</div>
            <div className="text-xs capitalize" style={{ color: '#4A5C4E' }}>{user?.role?.toLowerCase() || 'user'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/10 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 transition-all">
            <LogOut className="w-4 h-4" style={{ color: '#EF5350' }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: '#EF5350' }}>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0F1412' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0"
        style={{ background: 'rgba(27,35,30,0.95)', borderRight: '1px solid rgba(129,199,132,0.1)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col"
            style={{ background: 'rgba(15,20,18,0.98)', border: '1px solid rgba(129,199,132,0.15)' }}>
            <button className="absolute top-4 right-4 p-2 rounded-lg" style={{ color: '#5F6B63' }}
              onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 topbar-gradient flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(129,199,132,0.08)', minHeight: '72px' }}>
          {/* Mobile menu button */}
          <button className="lg:hidden p-2 rounded-xl" style={{ color: '#81C784', background: 'rgba(129,199,132,0.1)' }}
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* System indicator */}
          <div className="hidden lg:flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: '#81C784' }} />
            <span className="font-display font-semibold text-sm tracking-wider" style={{ color: '#81C784' }}>
              ELEPHANT DETECT SYSTEM
            </span>
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl transition-all hover:bg-white/5"
            style={{ background: 'rgba(129,199,132,0.08)', border: '1px solid rgba(129,199,132,0.15)' }}>
            <Bell className="w-4 h-4" style={{ color: '#81C784' }} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#EF5350', color: '#fff', fontSize: '9px' }}>
                {notifications}
              </span>
            )}
          </button>

          {/* Online status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(15,20,18,0.6)', border: '1px solid rgba(129,199,132,0.1)' }}>
            <div className="w-2 h-2 rounded-full status-online" />
            <span className="text-xs font-semibold hidden sm:block" style={{ color: '#A5D6A7' }}>
              {user?.name || 'Online'}
            </span>
          </div>

          {/* Clock */}
          <Clock />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
