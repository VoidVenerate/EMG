import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../../Components/UserNavbar/UserNavbar';

const UserLayout = () => {
  return (
    <>
      <UserNavbar />

      {/* User pages render here */}
      <Outlet />
    </>
  );
};

export default UserLayout;
