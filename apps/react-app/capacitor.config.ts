import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.youngeagles.dashboard',
  appName: 'Young Eagles Dashboard',
  webDir: 'dist',
  // For production build, comment out server config to use bundled files
  // server: {
  //   url: 'https://youngeagles-homework-app.vercel.app',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2563eb',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#2563eb'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
