import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, CheckCircle, TrendingUp } from 'lucide-react';

const API = 'http://localhost:3000/api';

export default function OwnerAnalytics() {
  const [stats, setStats] = useState({});
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    axios.get(`${API}/dashboard`).then(r => setStats(r.data)).catch(console.error);
    axios.get(`${API}/colleges`).then(r => setColleges(r.data)).catch(console.error);
  }, []);

  const placementRate = stats.total_students > 0
    ? Math.round(((stats.selected_count || 0) / stats.total_students) * 100) : 0;

  const STATUS_DATA = [
    { label: 'Applied', value: stats.applied_count || 0, color: '#3b82f6' },
    { label: 'Interview', value: stats.interview_count || 0, color: '#f59e0b' },
    { label: 'Selected', value: stats.selected_count || 0, color: '#22c55e' },
    { label: 'Rejected', value: stats.rejected_count || 0, color: '#ef4444' },
  ];
  const total = STATUS_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="page-header">
        <div><h1>Analytics</h1><p>Platform-wide placement analytics and insights</p></div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Colleges', value: stats.total_colleges || 0, icon: <Building2 size={20} />, color: '#4f46e5' },
          { label: 'Students', value: stats.total_students || 0, icon: <Users size={20} />, color: '#3b82f6' },
          { label: 'Placed', value: stats.selected_count || 0, icon: <CheckCircle size={20} />, color: '#22c55e' },
          { label: 'Placement Rate', value: placementRate + '%', icon: <TrendingUp size={20} />, color: '#f59e0b' },
        ].map(c => (
          <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: c.color + '18', color: c.color, padding: '0.8rem', borderRadius: '12px' }}>{c.icon}</div>
            <div><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.label}</p>
              <p style={{ fontWeight: 700, fontSize: '1.5rem' }}>{c.value}</p></div>
          </div>
        ))}
      </div>

      {/* Status Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Application Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STATUS_DATA.map(d => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{d.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: total > 0 ? (d.value / total) * 100 + '%' : '0%', height: '100%', background: d.color, borderRadius: '999px', transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>College-wise Placement</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {colleges.map(c => {
              const rate = c.total_students > 0 ? Math.round((c.placed_students / c.total_students) * 100) : 0;
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.placed_students}/{c.total_students} ({rate}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: rate + '%', height: '100%', background: rate >= 70 ? '#22c55e' : rate >= 40 ? '#f59e0b' : '#3b82f6', borderRadius: '999px', transition: 'width 1s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
