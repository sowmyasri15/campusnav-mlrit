import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = Object.values(firebaseConfig).every(Boolean);

export const app = isFirebaseEnabled
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = isFirebaseEnabled ? getAuth(app) : null;
export const db = isFirebaseEnabled ? getFirestore(app) : null;
export const googleProvider = isFirebaseEnabled ? new GoogleAuthProvider() : null;
