import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBdFJRnASzSwNrERZFmSGw0YY9t1t2fxBI",
  authDomain: "boostpro-c526d.firebaseapp.com",
  databaseURL: "https://boostpro-c526d-default-rtdb.firebaseio.com",
  projectId: "boostpro-c526d",
  storageBucket: "boostpro-c526d.firebasestorage.app",
  messagingSenderId: "218686343827",
  appId: "1:218686343827:web:10bcdeec9939b0d89a9b66"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);