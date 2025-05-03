import React from 'react';

const Footer = () => (
  <footer className="bg-blue-100 p-4 mt-auto w-full px-4 flex justify-center">
    <div className="text-center text-sm text-blue-600">
      © {new Date().getFullYear()} Young Eagles. All rights reserved.
    </div>
  </footer>
);

export default Footer;