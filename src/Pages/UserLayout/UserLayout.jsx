import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../../Components/UserNavbar/UserNavbar';
import SocialIcons from '../../Components/SocialIcons/SocialIcons';

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <SocialIcons />

      {/* User pages render here */}
      <Outlet />
    </>
  );
};

export default UserLayout;
