import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, CheckCircle } from 'lucide-react';

const API = 'http://localhost:3000/api';
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

export default function StudentCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState({});
  const user = getUser();
  const studentId = user.student_record_id;

  const fetch = () => {
    if (!studentId) { setLoading(false); return; }
    axios.get(`${API}/student/companies?student_id=${studentId}`)
      .then(r => { setCompanies(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const apply = async (companyId) => {
    try {
      await axios.post(`${API}/student/apply`, { student_id: studentId, company_id: companyId });
      setApplied(prev => ({ ...prev, [companyId]: true }));
      fetch();
    } catch (err) {
      if (err.response?.status === 409) setApplied(prev => ({ ...prev, [companyId]: true }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Available Companies</h1>
          <p>Companies you are eligible for based on your academic profile</p>
        </div>
        <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
          {companies.length} Eligible
        </span>
      </div>

      {loading && <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading eligible companies...</div>}

      {!loading && !studentId && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Your student profile is not complete. Please contact your admin to set up your academic details.</p>
        </div>
      )}

      {!loading && studentId && companies.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No eligible companies found. Check back later or contact your admin.</p>
        </div>
      )}

      <div className="grid-cards">
        {companies.map(c => {
          const isApplied = c.already_applied || applied[c.id];
          return (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: `4px solid ${isApplied ? '#22c55e' : '#4f46e5'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: isApplied ? '#dcfce7' : '#ede9fe', padding: '0.65rem', borderRadius: '10px' }}>
                    {isApplied ? <CheckCircle size={20} color="#22c55e" /> : <Briefcase size={20} color="#4f46e5" />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.1rem' }}>{c.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.role}</p>
                  </div>
                </div>
                <span style={{ background: '#f0fdf4', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>💰 {c.package}</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.jd || 'No job description provided.'}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#f0f9ff', color: '#075985', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem' }}>10th ≥ {c.min_10}%</span>
                <span style={{ background: '#f0f9ff', color: '#075985', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem' }}>12th ≥ {c.min_12}%</span>
                <span style={{ background: '#fefce8', color: '#713f12', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem' }}>CGPA ≥ {c.min_cgpa}</span>
                {(c.allowed_branches || []).map(b => <span key={b} style={{ background: '#ede9fe', color: '#4f46e5', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem' }}>{b}</span>)}
              </div>
              <button
                onClick={() => !isApplied && apply(c.id)}
                disabled={isApplied}
                style={{
                  padding: '0.65rem 1rem', borderRadius: '10px', border: 'none', cursor: isApplied ? 'default' : 'pointer',
                  background: isApplied ? '#dcfce7' : 'var(--primary)', color: isApplied ? '#166534' : 'white',
                  fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s', marginTop: 'auto'
                }}>
                {isApplied ? '✅ Applied' : '👉 Apply Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
