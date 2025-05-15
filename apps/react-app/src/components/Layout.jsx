import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => (
  <div className="flex flex-col h-screen bg">
    <Navbar />
    <main className="flex-grow ">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;