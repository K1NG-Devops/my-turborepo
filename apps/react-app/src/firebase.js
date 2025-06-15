// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyABl23C2T_smbFQgTypZ0cfii3faawwoe8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skydekstorage.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skydekstorage",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skydekstorage.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "482749285321",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:482749285321:web:3864dec67deca22f885e18",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZLBW552T6P"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services without automatic authentication
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Initialize messaging if supported
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { app, auth, storage, analytics, messaging };

