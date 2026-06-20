// Firebase Authentication helpers
// Supports: Email/Password + Google OAuth

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { createUserProfile } from './db';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with email and password, then create a Firestore user profile.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<UserCredential>}
 */
export const signUpWithEmail = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserProfile(credential.user.uid, { displayName, email });
  return credential;
};

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Initiate Google OAuth via redirect (avoids COOP popup issues in Chrome).
 * After redirect back, call handleGoogleRedirectResult() to complete sign-in.
 */
export const signInWithGoogle = () =>
  signInWithRedirect(auth, googleProvider);

/**
 * Call once on app load to capture the Google redirect result.
 * Creates Firestore profile on first sign-in.
 * @returns {Promise<UserCredential|null>}
 */
export const handleGoogleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result?.user) {
    await createUserProfile(result.user.uid, {
      displayName: result.user.displayName,
      email:       result.user.email,
    });
  }
  return result;
};

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export const signOut = () => firebaseSignOut(auth);

/**
 * Subscribe to auth state changes.
 * @param {(user: User|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const onAuthStateChanged = (callback) =>
  firebaseOnAuthStateChanged(auth, callback);

