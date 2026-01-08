import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar'

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      
      {/* 1️⃣ This is the ADMIN SIDEBAR */}
      <AdminNavbar />

      {/* 2️⃣ This is the CONTENT AREA */}
      <div style={{ width: '100%' }}>
        
        {/* 3️⃣ The CURRENT ADMIN PAGE appears HERE */}
        <Outlet />

      </div>
    </div>
  );
};
export default AdminLayout;