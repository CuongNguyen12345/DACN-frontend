import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC39eYj8DFEdv3URkIG5UZ8QGIWBt0LG1M",
  authDomain: "edu4all-6c6bb.firebaseapp.com",
  projectId: "edu4all-6c6bb",
  storageBucket: "edu4all-6c6bb.firebasestorage.app",
  messagingSenderId: "425104624186",
  appId: "1:425104624186:web:a0db888451ba8cb0138303",
  measurementId: "G-VW28YBKSYJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
