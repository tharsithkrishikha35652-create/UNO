import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const requiredFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseConfig = {
  ...requiredFirebaseConfig,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseConfigReady = Object.values(requiredFirebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0
);

export const firebaseApp = firebaseConfigReady
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

export const analytics: Analytics | null =
  firebaseApp && typeof window !== 'undefined'
    ? (() => {
        try {
          return getAnalytics(firebaseApp);
        } catch {
          return null;
        }
      })()
    : null;
