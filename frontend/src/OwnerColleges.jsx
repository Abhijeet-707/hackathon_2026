import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Building2 } from 'lucide-react';

const API = 'http://localhost:3000/api';

export default function OwnerColleges() {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetch = () => axios.get(`${API}/colleges`).then(r => setColleges(r.data)).catch(console.error);
  useEffect(() => { fetch(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/colleges`, { name });
    setName(''); setShowForm(false); fetch();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete college and all associated data?')) return;
    await axios.delete(`${API}/colleges/${id}`); fetch();
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Colleges</h1><p>Manage all registered colleges on the platform</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={18} /> Add College</button>
      </div>
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="input-label">College Name *</label>
            <input required className="input-field" placeholder="e.g. VIT Mumbai" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={add}>Create College</button>
          <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3>All Colleges ({colleges.length})</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {['#', 'College Name', 'Admin Email', 'Students', 'Placed', 'Rate', 'Actions'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {colleges.map((c, i) => {
              const rate = c.total_students > 0 ? Math.round((c.placed_students / c.total_students) * 100) : 0;
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} color="#4f46e5" /> {c.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.admin_email || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{c.total_students}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#22c55e', fontWeight: 600 }}>{c.placed_students}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ color: rate >= 70 ? '#22c55e' : rate >= 40 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{rate}%</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => remove(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
            {colleges.length === 0 && <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No colleges yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
