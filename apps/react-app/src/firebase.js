// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyABl23C2T_smbFQgTypZ0cfii3faawwoe8",
  authDomain: "skydekstorage.firebaseapp.com",
  projectId: "skydekstorage",
  storageBucket: "skydekstorage.firebasestorage.app",
  messagingSenderId: "482749285321",
  appId: "1:482749285321:web:3864dec67deca22f885e18",
  measurementId: "G-ZLBW552T6P"
};

const app = initializeApp(firebaseConfig);

// Sign in anonymously once when the app starts
const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Anonymous sign-in error:", error);
  });

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

export { app, storage, analytics, messaging };

