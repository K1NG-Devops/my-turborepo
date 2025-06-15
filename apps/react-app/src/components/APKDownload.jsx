import React, { useState, useEffect } from 'react';
import { FaDownload, FaAndroid, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const APKDownload = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.github.com/repos/K1NG-Devops/my-turborepo/releases');
      
      if (!response.ok) {
        throw new Error('Failed to fetch releases');
      }
      
      const data = await response.json();
      const apkReleases = data.filter(release => 
        release.assets.some(asset => asset.name.endsWith('.apk'))
      );
      
      setReleases(apkReleases);
      setError(null);
    } catch (err) {
      console.error('Error fetching releases:', err);
      setError('Unable to load APK releases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadUrl, fileName) => {
    // Track download
    if (window.gtag) {
      window.gtag('event', 'download', {
        event_category: 'APK',
        event_label: fileName
      });
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('APK download started!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading APK releases...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={fetchReleases}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <FaAndroid className="text-green-500 text-4xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Young Eagles App</h2>
        <p className="text-gray-600">Get the latest version of our Android app</p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <FaShieldAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Security & Installation</h3>
            <p className="text-blue-700 text-sm">
              Our APK is digitally signed and safe to install. You may need to enable 
              "Install from unknown sources" in your Android settings for first-time installation.
            </p>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Installation Steps:</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Download the APK file</li>
          <li>2. Open the downloaded file</li>
          <li>3. If prompted, allow installation from unknown sources</li>
          <li>4. Follow the installation prompts</li>
          <li>5. Launch the Young Eagles app!</li>
        </ol>
      </div>

      {/* Releases List */}
      {releases.length === 0 ? (
        <div className="text-center py-8">
          <FaAndroid className="text-gray-300 text-3xl mx-auto mb-4" />
          <p className="text-gray-500">No APK releases available yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            APK builds are generated automatically when code is updated.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {releases.map((release) => {
            const apkAssets = release.assets.filter(asset => asset.name.endsWith('.apk'));
            
            return (
              <div key={release.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {release.name || `Version ${release.tag_name}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Released on {formatDate(release.published_at)}
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-1" />
                    <span className="text-sm font-medium">Latest</span>
                  </div>
                </div>
                
                {release.body && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{release.body}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {apkAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <FaAndroid className="text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(asset.size)} • Downloaded {asset.download_count} times
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(asset.browser_download_url, asset.name)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alternative Download Methods */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Alternative Options:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Use as Web App</h4>
            <p className="text-sm text-gray-600 mb-3">
              Use our app directly in your browser with full functionality.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Open Web App →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Install as PWA</h4>
            <p className="text-sm text-gray-600 mb-3">
              Add to your home screen for an app-like experience.
            </p>
            <button 
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  toast.info('Use your browser\'s "Add to Home Screen" option!');
                }
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Learn How →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APKDownload;

