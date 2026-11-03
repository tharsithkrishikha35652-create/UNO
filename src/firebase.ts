import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const rawFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates required Firebase client environment variables at application startup.
 * Fails loudly with detailed diagnostic errors if any required key is missing or malformed.
 */
export function validateFirebaseEnvironment(customConfig?: Partial<typeof rawFirebaseConfig>): EnvValidationResult {
  const errors: string[] = [];

  const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = customConfig ?? rawFirebaseConfig;

  // 1. API Key validation
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    errors.push('VITE_FIREBASE_API_KEY is missing');
  } else if (!/^AIza[0-9A-Za-z\-_]{35}$/.test(apiKey.trim())) {
    errors.push('VITE_FIREBASE_API_KEY is malformed (expected standard 39-character string starting with "AIza")');
  }

  // 2. Auth Domain validation
  if (!authDomain || typeof authDomain !== 'string' || !authDomain.trim()) {
    errors.push('VITE_FIREBASE_AUTH_DOMAIN is missing');
  } else if (!/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(authDomain.trim())) {
    errors.push('VITE_FIREBASE_AUTH_DOMAIN is malformed (must be a valid domain)');
  }

  // 3. Project ID validation
  if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
    errors.push('VITE_FIREBASE_PROJECT_ID is missing');
  } else if (!/^[a-z0-9-]+$/.test(projectId.trim())) {
    errors.push('VITE_FIREBASE_PROJECT_ID is malformed (only lowercase letters, digits, and hyphens permitted)');
  }

  // 4. Storage Bucket validation
  if (!storageBucket || typeof storageBucket !== 'string' || !storageBucket.trim()) {
    errors.push('VITE_FIREBASE_STORAGE_BUCKET is missing');
  }

  // 5. Messaging Sender ID validation
  if (!messagingSenderId || typeof messagingSenderId !== 'string' || !messagingSenderId.trim()) {
    errors.push('VITE_FIREBASE_MESSAGING_SENDER_ID is missing');
  } else if (!/^\d+$/.test(messagingSenderId.trim())) {
    errors.push('VITE_FIREBASE_MESSAGING_SENDER_ID must contain digits only');
  }

  // 6. App ID validation
  if (!appId || typeof appId !== 'string' || !appId.trim()) {
    errors.push('VITE_FIREBASE_APP_ID is missing');
  } else if (!/^1:\d+:[a-zA-Z0-9_.-]+:[a-zA-Z0-9]+$/.test(appId.trim())) {
    errors.push('VITE_FIREBASE_APP_ID format is malformed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const validation = validateFirebaseEnvironment();

export const firebaseValidationError: string | null = validation.isValid
  ? null
  : validation.errors.join('; ');

import { logSecurityEvent } from './securityLogger';

if (!validation.isValid) {
  logSecurityEvent('CONFIG_VALIDATION_FAILURE', 'error', {
    errorsCount: validation.errors.length,
    issues: validation.errors,
  });
  console.error(
    `[SECURITY/CONFIG ERROR] Firebase environment validation failed with ${validation.errors.length} issue(s):\n` +
      validation.errors.map((e) => `  - ${e}`).join('\n')
  );
}

export const firebaseConfigReady = validation.isValid;

const firebaseConfig = {
  apiKey: rawFirebaseConfig.apiKey,
  authDomain: rawFirebaseConfig.authDomain,
  projectId: rawFirebaseConfig.projectId,
  storageBucket: rawFirebaseConfig.storageBucket,
  messagingSenderId: rawFirebaseConfig.messagingSenderId,
  appId: rawFirebaseConfig.appId,
  measurementId: rawFirebaseConfig.measurementId,
};

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
