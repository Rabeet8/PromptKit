import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

let app;
let auth: any;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  console.log("Checking persistence availability:", typeof getReactNativePersistence);
  let authPersistence;
  if (typeof getReactNativePersistence === 'function') {
    authPersistence = getReactNativePersistence(AsyncStorage);
  } else {
    console.warn("getReactNativePersistence is not a function! Auth persistence will fail.");
  }

  auth = initializeAuth(app, {
    persistence: authPersistence
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };
export const database = getDatabase(app);