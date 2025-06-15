import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone || 
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setCanInstall(false);
      toast.success('App installed successfully!', {
        description: 'You can now access Young Eagles from your home screen'
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          toast.success('Installing app...', {
            description: 'The app will be added to your home screen'
          });
        } else {
          toast.info('Installation cancelled', {
            description: 'You can install the app later from the browser menu'
          });
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        setCanInstall(false);
      } catch (error) {
        console.error('Installation failed:', error);
        toast.error('Installation failed', {
          description: 'Please try installing from your browser menu'
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed in this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // iOS specific prompt
  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 18a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">Install Young Eagles App</h3>
              <p className="text-xs text-blue-100 mb-3">
                Add this app to your home screen for easy access and push notifications!
              </p>
              <div className="text-xs text-blue-100 space-y-1">
                <div className="flex items-center space-x-2">
                  <span>1.</span>
                  <span>Tap the Share button</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span>2.</span>
                  <span>Select "Add to Home Screen"</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-blue-200 hover:text-white"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop prompt
  if (showInstallPrompt && canInstall) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img src="/app-icons/yehc_logo.png" alt="Young Eagles" className="w-12 h-12 rounded-full" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Install Young Eagles App
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Get instant push notifications and quick access from your home screen!
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;

