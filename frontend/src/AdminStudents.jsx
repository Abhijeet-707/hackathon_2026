import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Search } from 'lucide-react';

const API = 'http://localhost:3000/api';
const getAdmin = () => JSON.parse(localStorage.getItem('user') || '{}');
const emptyForm = { name: '', email: '', enrollment: '', course: '', branch: '', division: '', tenth_percent: '', twelfth_percent: '', cgpa: '', password: '123' };
const COURSES = ['BTech', 'BCA', 'MCA', 'BBA', 'BSc', 'MCom'];
const BRANCHES = ['CE', 'IT', 'ECE', 'ME', 'Civil', 'EE', 'CS'];

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterCourse, setFilterCourse] = useState('All');

  const admin = getAdmin();
  const fetch = () => axios.get(`${API}/admin/students?college_id=${admin.college_id}`).then(r => setStudents(r.data)).catch(console.error);
  useEffect(() => { fetch(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/students`, { ...form, college_id: admin.college_id });
      setForm(emptyForm); setShowForm(false); fetch();
    } catch (err) { alert(err.response?.data?.error || 'Error adding student'); }
  };

  const remove = async (id) => { if (!window.confirm('Remove student?')) return; await axios.delete(`${API}/admin/students/${id}`); fetch(); };

  const f = s => s.name; // just help autocomplete
  const display = students
    .filter(s => filterBranch === 'All' || s.branch === filterBranch)
    .filter(s => filterCourse === 'All' || s.course === filterCourse)
    .filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.enrollment?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div><h1>Student Management</h1><p>Add and manage student records</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={18} /> Add Student</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Register New Student</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'e.g. Rahul Sharma' },
                { label: 'Email *', key: 'email', type: 'email', placeholder: 'student@college.edu' },
                { label: 'Enrollment No *', key: 'enrollment', type: 'text', placeholder: 'EN2021001' },
                { label: 'Division', key: 'division', type: 'text', placeholder: 'A / B / C' },
                { label: '10th %', key: 'tenth_percent', type: 'number', placeholder: '85.00' },
                { label: '12th %', key: 'twelfth_percent', type: 'number', placeholder: '78.00' },
                { label: 'CGPA', key: 'cgpa', type: 'number', placeholder: '8.50' },
                { label: 'Default Password', key: 'password', type: 'text', placeholder: '123' },
              ].map(f => (
                <div key={f.key} className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">{f.label}</label>
                  <input required={f.label.includes('*')} type={f.type} step="0.01" className="input-field" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Course *</label>
                <select required className="input-field" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
                  <option value="">Select</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Branch *</label>
                <select required className="input-field" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                  <option value="">Select</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn-primary">Add Student</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem 1rem', flex: 1, minWidth: '200px' }}>
          <Search size={15} color="var(--text-muted)" />
          <input style={{ border: 'none', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '0.875rem' }} placeholder="Search by name, email, enrollment..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 'auto', margin: 0 }} value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
          <option value="All">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="input-field" style={{ width: 'auto', margin: 0 }} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
          <option value="All">All Courses</option>
          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{display.length} shown</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {['Name', 'Email', 'Enrollment', 'Course', 'Branch', 'Div', '10th', '12th', 'CGPA', 'Del'].map(h => (
              <th key={h} style={{ padding: '0.75rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {display.map(s => (
              <tr key={s.student_id || s.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.email}</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#4f46e5' }}>{s.enrollment}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{s.course}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span style={{ background: '#ede9fe', color: '#4f46e5', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{s.branch}</span></td>
                <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.division}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{s.tenth_percent}%</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{s.twelfth_percent}%</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: parseFloat(s.cgpa) >= 7.5 ? '#22c55e' : parseFloat(s.cgpa) >= 6 ? '#f59e0b' : '#ef4444' }}>{s.cgpa}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={15} /></button></td>
              </tr>
            ))}
            {display.length === 0 && <tr><td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
