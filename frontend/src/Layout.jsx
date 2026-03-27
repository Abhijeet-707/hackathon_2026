import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setRole(JSON.parse(u).role);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f8' }}>
      <Sidebar role={role} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: 'calc(100vw - 260px)' }}>
        <Outlet />
      </main>
    </div>
  );
}
