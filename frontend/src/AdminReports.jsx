import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';

const API = 'http://localhost:3000/api';
const getAdmin = () => JSON.parse(localStorage.getItem('user') || '{}');

export default function AdminReports() {
  const [apps, setApps] = useState([]);
  const admin = getAdmin();
  useEffect(() => { axios.get(`${API}/applications?college_id=${admin.college_id}`).then(r => setApps(r.data)).catch(console.error); }, []);

  const exportCSV = () => {
    const rows = [['Student', 'Branch', 'Course', 'CGPA', 'Company', 'Role', 'Package', 'Status', 'Interview Date'],
      ...apps.map(a => [a.student_name, a.branch, a.course, a.cgpa, a.company_name, a.company_role, a.package, a.status, a.interview_date ? new Date(a.interview_date).toLocaleDateString() : '—'])];
    const csv = rows.map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'placement_report.csv'; a.click();
  };

  const selected = apps.filter(a => a.status === 'Selected').length;
  const rate = apps.length ? Math.round((selected / apps.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div><h1>Placement Reports</h1><p>Export and review college placement data</p></div>
        <button className="btn-primary" onClick={exportCSV}><Download size={18} /> Download CSV</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Applications', value: apps.length, color: '#4f46e5' },
          { label: 'Selected', value: selected, color: '#22c55e' },
          { label: 'In Interview', value: apps.filter(a => a.status === 'Interview').length, color: '#f59e0b' },
          { label: 'Success Rate', value: rate + '%', color: '#3b82f6' },
        ].map(c => (
          <div key={c.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: c.color }}>{c.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Full Report Preview</h3>
          <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead><tr style={{ background: '#f9fafb' }}>
              {['Student', 'Branch', 'CGPA', 'Company', 'Role', 'Package', 'Status', 'Interview'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{a.student_name}</td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{a.branch}</td>
                  <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: parseFloat(a.cgpa) >= 7.5 ? '#22c55e' : '#f59e0b' }}>{a.cgpa}</td>
                  <td style={{ padding: '0.65rem 1rem' }}>{a.company_name}</td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{a.company_role}</td>
                  <td style={{ padding: '0.65rem 1rem', color: '#22c55e', fontWeight: 600 }}>{a.package}</td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: a.status === 'Selected' ? '#bbf7d0' : a.status === 'Rejected' ? '#fee2e2' : a.status === 'Interview' ? '#fef9c3' : '#dbeafe', color: a.status === 'Selected' ? '#166534' : a.status === 'Rejected' ? '#991b1b' : a.status === 'Interview' ? '#713f12' : '#1e40af' }}>{a.status}</span>
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{a.interview_date ? new Date(a.interview_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
