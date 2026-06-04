/**
 * EleGuard Firebase Realtime Database Service
 *
 * Configure your Firebase project by setting these environment variables
 * in a .env file at the project root:
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=...
 *   VITE_FIREBASE_DATABASE_URL=...
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * The heatmap listens to the "sensors" node. Expected structure:
 *   sensors/S1: 12          (raw distance integer)
 *   sensors/S1: { distance: 12, ... }   (object with distance field)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Prevent duplicate app initialization during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const database = getDatabase(app);
export { ref, onValue, off };
