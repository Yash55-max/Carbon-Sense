// Firebase SDK initialization
// Credentials are loaded from environment variables — never hardcoded.
// Replace values in frontend/.env with your Firebase project config.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfigObject';

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
