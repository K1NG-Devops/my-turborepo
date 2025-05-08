// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

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

const analytics = getAnalytics(app);

const storage = getStorage(app);
export { app, storage, analytics };

