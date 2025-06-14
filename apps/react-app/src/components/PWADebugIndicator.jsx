import React from 'react';
import usePWA from '../hooks/usePWA';

const PWADebugIndicator = () => {
  const { isStandalone, isInstallable } = usePWA();
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 z-50 bg-black bg-opacity-75 text-white text-xs p-2 rounded-br-lg">
      <div>PWA: {isStandalone ? '✅ Standalone' : '❌ Browser'}</div>
      <div>Install: {isInstallable ? '✅ Available' : '❌ Not Available'}</div>
      <div>Display: {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}</div>
    </div>
  );
};

export default PWADebugIndicator;

