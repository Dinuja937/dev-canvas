import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 w-full flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
