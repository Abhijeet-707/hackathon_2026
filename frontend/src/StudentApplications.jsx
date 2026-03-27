import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api';
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
const STATUS_COLORS = {
  Applied: { bg: '#dbeafe', text: '#1e40af' },
  Interview: { bg: '#fef9c3', text: '#713f12' },
  Selected: { bg: '#dcfce7', text: '#166534' },
  Rejected: { bg: '#fee2e2', text: '#991b1b' },
};
const STATUSES = ['All', 'Applied', 'Interview', 'Selected', 'Rejected'];

export default function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('All');
  const user = getUser();
  const studentId = user.student_record_id;

  useEffect(() => {
    if (studentId) axios.get(`${API}/applications?student_id=${studentId}`).then(r => setApps(r.data)).catch(console.error);
  }, [studentId]);

  const display = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header">
        <div><h1>My Applications</h1><p>Track all your placement applications</p></div>
        <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>{apps.length} Total</span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '0.4rem 1rem', borderRadius: '9999px', border: filter === s ? 'none' : '1px solid var(--border)',
            background: filter === s ? 'var(--primary)' : 'white', color: filter === s ? 'white' : 'var(--text-muted)',
            cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem'
          }}>{s} ({s === 'All' ? apps.length : apps.filter(a => a.status === s).length})</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {display.map(a => {
          const colors = STATUS_COLORS[a.status] || STATUS_COLORS.Applied;
          return (
            <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${colors.text}` }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#f3f4f6', borderRadius: '10px', padding: '0.75rem', minWidth: '44px', textAlign: 'center', fontWeight: 700, color: '#4f46e5', fontSize: '1.1rem' }}>
                  {(a.company_name || '?')[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>{a.company_name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.company_role} · <span style={{ color: '#22c55e', fontWeight: 600 }}>{a.package}</span></p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Applied: {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: colors.bg, color: colors.text, padding: '0.3rem 0.9rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>{a.status}</span>
                {a.interview_date && (
                  <p style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 500 }}>📅 {new Date(a.interview_date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          );
        })}
        {display.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>{filter === 'All' ? 'No applications yet. Go to Available Companies to apply!' : `No ${filter} applications.`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
