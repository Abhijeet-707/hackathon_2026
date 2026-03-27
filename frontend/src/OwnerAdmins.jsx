import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Eye, EyeOff, Copy } from 'lucide-react';

const API = 'http://localhost:3000/api';
const genPwd = (name) => name.substring(0, 4).toLowerCase() + '@' + Math.floor(1000 + Math.random() * 9000);

export default function OwnerAdmins() {
  const [admins, setAdmins] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', college_id: '', password: '' });
  const [visiblePwd, setVisiblePwd] = useState({});
  const [copied, setCopied] = useState('');
  const [newCreds, setNewCreds] = useState({});

  const fetchAll = () => {
    axios.get(`${API}/admins`).then(r => setAdmins(r.data)).catch(console.error);
    axios.get(`${API}/colleges`).then(r => setColleges(r.data)).catch(console.error);
  };
  useEffect(() => { fetchAll(); }, []);

  const openForm = () => {
    const pwd = genPwd('admin');
    setForm({ name: '', email: '', college_id: '', password: pwd });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/owner/create-admin`, form);
      setNewCreds(prev => ({ ...prev, [res.data.id]: { email: form.email, password: form.password } }));
      setShowForm(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Error creating admin'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this admin?')) return;
    await axios.delete(`${API}/admins/${id}`); fetchAll();
  };

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000); };

  return (
    <div>
      <div className="page-header">
        <div><h1>Admin Management</h1><p>Create and manage college administrators</p></div>
        <button className="btn-primary" onClick={openForm}><Plus size={18} /> Create Admin</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', background: '#f9fafb' }}>
          <h3 style={{ marginBottom: '1rem' }}>Register College Admin</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Admin Full Name *</label>
                <input required className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Prof. Sharma" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Email Address *</label>
                <input required type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@college.edu" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Assign College *</label>
                <select required className="input-field" value={form.college_id} onChange={e => setForm({ ...form, college_id: e.target.value })}>
                  <option value="">Select College</option>
                  {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Generated Password</label>
                <input className="input-field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn-primary">Create Admin & Generate Credentials</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {Object.keys(newCreds).length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ color: '#166534', marginBottom: '0.75rem' }}>✅ New Admin Credentials (share with admin)</h4>
          {Object.entries(newCreds).map(([id, c]) => (
            <div key={id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>Email: <code style={{ background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{c.email}</code>
                <button onClick={() => copy(c.email, id + 'e')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === id + 'e' ? '#22c55e' : '#6b7280' }}><Copy size={13} /></button>
              </div>
              <div>Password: <code style={{ background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{visiblePwd[id] ? c.password : '••••••'}</code>
                <button onClick={() => setVisiblePwd(p => ({ ...p, [id]: !p[id] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>{visiblePwd[id] ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                <button onClick={() => copy(c.password, id + 'p')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === id + 'p' ? '#22c55e' : '#6b7280' }}><Copy size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}><h3>All Admins ({admins.length})</h3></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {['Name', 'Email', 'College', 'Actions'].map(h => (
              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{a.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.email}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{a.college_name || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No admins registered yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
