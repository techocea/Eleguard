import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Clock, Wifi } from 'lucide-react';
import { mockHistory } from '../services/api';
import { THREAT_COLORS, threatLevelToColor } from '../utils/sensorLogic';

const STATUS_WEIGHT = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 6;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const res = mockHistory();
      setData(res.data.items);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = data.filter(item => {
    const matchSearch = item.sensorId.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
  };

  const stats = {
    total: data.length,
    critical: data.filter(d => d.status === 'CRITICAL').length,
    high: data.filter(d => d.status === 'HIGH').length,
    thisWeek: data.filter(d => {
      const d2 = new Date(d.timestamp);
      const now = new Date();
      return (now - d2) < 7 * 24 * 60 * 60 * 1000;
    }).length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold" style={{ color: '#E8F5E9' }}>Sensor History</h2>
        <p className="text-sm mt-1" style={{ color: '#5F6B63' }}>Complete log of elephant detection events</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: stats.total, color: '#81C784' },
          { label: 'This Week', value: stats.thisWeek, color: '#A5D6A7' },
          { label: 'High Alerts', value: stats.high, color: '#FF8F00' },
          { label: 'Critical', value: stats.critical, color: '#EF5350' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl"
            style={{ background: 'rgba(27,35,30,0.7)', border: '1px solid rgba(129,199,132,0.1)' }}>
            <div className="text-xs mb-1" style={{ color: '#5F6B63' }}>{label}</div>
            <div className="font-display text-3xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5F6B63' }} />
          <input
            type="text"
            placeholder="Search sensor ID or status..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            style={{ background: 'rgba(27,35,30,0.8)', border: '1px solid rgba(129,199,132,0.15)', color: '#E8F5E9' }}
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => {
            const colors = s !== 'ALL' ? THREAT_COLORS[threatLevelToColor(STATUS_WEIGHT[s] || 0)] : null;
            return (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={filterStatus === s
                  ? { background: colors?.bg || 'rgba(129,199,132,0.2)', color: colors?.dot || '#81C784', border: `1px solid ${colors?.border || '#81C784'}` }
                  : { background: 'rgba(27,35,30,0.6)', color: '#5F6B63', border: '1px solid rgba(129,199,132,0.1)' }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(27,35,30,0.7)', border: '1px solid rgba(129,199,132,0.1)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(129,199,132,0.08)' }}>
          <div className="grid grid-cols-5 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#3D5C41' }}>
            <div>Sensor</div>
            <div>Status</div>
            <div>Date</div>
            <div>Time</div>
            <div>Duration</div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: '#81C784', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#3D5C41' }}>Loading history...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3 opacity-30">📋</div>
            <p className="text-sm" style={{ color: '#3D5C41' }}>No events found</p>
          </div>
        ) : (
          paginated.map((item, i) => {
            const { date, time } = formatTime(item.timestamp);
            const colors = THREAT_COLORS[threatLevelToColor(STATUS_WEIGHT[item.status] || 0)];
            return (
              <div key={item.id}
                className="grid grid-cols-5 p-4 table-row-hover transition-colors duration-150"
                style={{ borderBottom: i < paginated.length - 1 ? '1px solid rgba(129,199,132,0.05)' : 'none' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(15,20,18,0.8)', border: '1px solid rgba(129,199,132,0.15)' }}>
                    <Wifi className="w-3 h-3" style={{ color: '#81C784' }} />
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: '#E8F5E9' }}>{item.sensorId}</span>
                </div>

                <div>
                  <span className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={{ background: colors.bg, color: colors.dot, border: `1px solid ${colors.border}30` }}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm" style={{ color: '#B0BEC5' }}>
                  <Clock className="w-3 h-3" />
                  {date}
                </div>

                <div className="font-mono text-sm" style={{ color: '#81C784' }}>{time}</div>

                <div className="text-sm" style={{ color: '#5F6B63' }}>{item.duration}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#3D5C41' }}>
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(129,199,132,0.15)', color: '#81C784' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className="w-8 h-8 rounded-xl text-xs font-bold transition-all"
                style={page === i + 1
                  ? { background: '#2E7D32', color: '#E8F5E9' }
                  : { border: '1px solid rgba(129,199,132,0.15)', color: '#5F6B63' }}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(129,199,132,0.15)', color: '#81C784' }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
