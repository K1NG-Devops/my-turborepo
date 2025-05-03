import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="flex flex-col h-screen bg">
    <Navbar />
    <main className="flex-grow ">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;