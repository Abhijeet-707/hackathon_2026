import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const API = 'http://localhost:3000/api';
const getAdmin = () => JSON.parse(localStorage.getItem('user') || '{}');
const STATUS_COLORS = { Applied: 'badge-applied', Interview: 'badge-interview', Selected: 'badge-offer', Rejected: 'badge-rejected' };
const STATUSES = ['All', 'Applied', 'Interview', 'Selected', 'Rejected'];

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ status: '', interview_date: '' });

  const admin = getAdmin();
  const fetchApps = () => axios.get(`${API}/applications?college_id=${admin.college_id}`).then(r => setApps(r.data)).catch(console.error);
  useEffect(() => {
    fetchApps();
    axios.get(`${API}/companies?college_id=${admin.college_id}`).then(r => setCompanies(r.data)).catch(console.error);
  }, []);

  const startEdit = (app) => { setEditingId(app.id); setEditData({ status: app.status, interview_date: app.interview_date ? app.interview_date.split('T')[0] : '' }); };
  const saveEdit = async (id) => {
    await axios.put(`${API}/applications/${id}/status`, editData);
    setEditingId(null); fetchApps();
  };

  const display = apps
    .filter(a => filterStatus === 'All' || a.status === filterStatus)
    .filter(a => filterCompany === 'All' || a.company_id === parseInt(filterCompany))
    .filter(a => !search || a.student_name?.toLowerCase().includes(search.toLowerCase()) || a.company_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div><h1>Applications</h1><p>View and manage all student applications</p></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem 1rem', flex: 1, minWidth: '200px' }}>
          <Search size={15} color="var(--text-muted)" />
          <input style={{ border: 'none', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '0.875rem' }} placeholder="Search student or company..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '0.4rem 0.9rem', borderRadius: '9999px', border: filterStatus === s ? 'none' : '1px solid var(--border)',
              background: filterStatus === s ? 'var(--primary)' : 'white', color: filterStatus === s ? 'white' : 'var(--text-muted)',
              cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem'
            }}>{s}</button>
          ))}
        </div>
        <select className="input-field" style={{ width: 'auto', margin: 0 }} value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
          <option value="All">All Companies</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3>{display.length} Application{display.length !== 1 ? 's' : ''}</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {['Student', 'Company', 'Role', 'Package', 'Status', 'Interview Date', 'Actions'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {display.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                  {a.student_name}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.branch} · {a.course} · CGPA: {a.cgpa}</div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{a.company_name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{a.company_role}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#22c55e', fontWeight: 600 }}>{a.package}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editingId === a.id ? (
                    <select className="input-field" style={{ margin: 0, width: 'auto', padding: '0.3rem 0.5rem' }} value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                      {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {editingId === a.id ? (
                    <input type="date" className="input-field" style={{ margin: 0, width: 'auto', padding: '0.3rem 0.5rem' }} value={editData.interview_date} onChange={e => setEditData({ ...editData, interview_date: e.target.value })} />
                  ) : a.interview_date ? new Date(a.interview_date).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {editingId === a.id ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => saveEdit(a.id)} className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(a)} style={{ background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: '8px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Update Status</button>
                  )}
                </td>
              </tr>
            ))}
            {display.length === 0 && <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No applications found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
