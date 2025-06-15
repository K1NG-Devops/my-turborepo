import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import APKDownload from '../components/APKDownload';

const DownloadApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <img
                src="/app-icons/yehc_logo.png"
                alt="Young Eagles"
                className="h-8 w-8 rounded-full object-cover"
              />
              <h1 className="text-lg font-bold text-gray-900">Young Eagles</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FaHome className="mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download Young Eagles App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get our mobile app for the best experience managing your child's education, 
            homework, and school communications.
          </p>
        </div>

        {/* APK Download Component */}
        <APKDownload />

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Download Our App?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Native Experience</h3>
              <p className="text-gray-600 text-sm">
                Optimized for mobile with smooth navigation and native Android features.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Push Notifications</h3>
              <p className="text-gray-600 text-sm">
                Get instant notifications for homework, events, and important school updates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Offline Access</h3>
              <p className="text-gray-600 text-sm">
                Access homework and resources even when you're offline.
              </p>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">System Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Minimum Requirements:</h4>
              <ul className="space-y-1">
                <li>• Android 6.0 (API level 23) or higher</li>
                <li>• 100 MB free storage space</li>
                <li>• Internet connection for sync</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Recommended:</h4>
              <ul className="space-y-1">
                <li>• Android 8.0 or higher</li>
                <li>• 2GB RAM or more</li>
                <li>• Wi-Fi or 4G connection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any issues downloading or installing the app, please contact our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Support
            </Link>
            <Link 
              to="/help"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              View Help Docs
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Young Eagles Home Care Centre. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link to="/contact" className="hover:text-gray-900">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DownloadApp;

