import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GraduationCap, Briefcase, CheckCircle, Clock, Users } from 'lucide-react';

const API = 'http://localhost:3000/api';
const getAdmin = () => JSON.parse(localStorage.getItem('user') || '{}');

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const admin = getAdmin();
    axios.get(`${API}/dashboard?college_id=${admin.college_id}`).then(r => setStats(r.data)).catch(console.error);
    axios.get(`${API}/admin/students?college_id=${admin.college_id}`).then(r => setStudents(r.data)).catch(console.error);
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.total_students || students.length || 0, color: '#4f46e5', icon: <GraduationCap size={20} /> },
    { label: 'Total Applications', value: stats.total_applications || 0, color: '#3b82f6', icon: <Briefcase size={20} /> },
    { label: 'Interviews', value: stats.interview_count || 0, color: '#f59e0b', icon: <Clock size={20} /> },
    { label: 'Selected', value: stats.selected_count || 0, color: '#22c55e', icon: <CheckCircle size={20} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>Admin Dashboard</h1><p>College-level placement overview</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: c.color + '18', color: c.color, padding: '0.8rem', borderRadius: '12px' }}>{c.icon}</div>
            <div><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.label}</p>
              <p style={{ fontWeight: 700, fontSize: '1.5rem' }}>{c.value}</p></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3>Recent Students</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {['Name', 'Course', 'Branch', '10th', '12th', 'CGPA'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {students.slice(0, 8).map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.course}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.branch}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{s.tenth_percent}%</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{s.twelfth_percent}%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: parseFloat(s.cgpa) >= 7.5 ? '#22c55e' : parseFloat(s.cgpa) >= 6 ? '#f59e0b' : '#ef4444' }}>{s.cgpa}</td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
