// Firestore CRUD helpers for CarbonSense
// Document schema:
//   users/{uid}/profile          — { displayName, email, rank, carbonCredits, joinedAt }
//   users/{uid}/state/current    — { monthlyFootprint, streakDays, activities, unlockedBadges, history }
//   users/{uid}/challenges/{id}  — { progress, completedAt, active }

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Creates a Firestore user profile if it does not yet exist (idempotent).
 * @param {string} uid
 * @param {{ displayName: string, email: string }} data
 */
export const createUserProfile = async (uid, { displayName, email }) => {
  const ref = doc(db, 'users', uid, 'profile', 'data');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName,
      email,
      rank:          0,
      carbonCredits: 0,
      joinedAt:      serverTimestamp(),
    });
  }
};

/**
 * Fetch user profile from Firestore.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
  return snap.exists() ? snap.data() : null;
};

// ─── State / Activity Data ────────────────────────────────────────────────────

/**
 * Load the user's current carbon state from Firestore.
 * Returns null if no state saved yet (context will use initialState).
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export const getUserState = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'state', 'current'));
  return snap.exists() ? snap.data() : null;
};

/**
 * Save the full carbon state to Firestore.
 * Also caches to localStorage as offline fallback.
 * @param {string} uid
 * @param {Object} state
 */
export const saveUserState = async (uid, state) => {
  const ref = doc(db, 'users', uid, 'state', 'current');
  const payload = {
    monthlyFootprint: state.monthlyFootprint,
    streakDays:       state.streakDays,
    activities:       state.activities,
    unlockedBadges:   state.unlockedBadges,
    history:          state.history,
    updatedAt:        serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
  // Offline cache
  try {
    localStorage.setItem(`cs_state_${uid}`, JSON.stringify({ ...payload, updatedAt: Date.now() }));
  } catch (_) { /* quota exceeded — silently fail */ }
};

/**
 * Load user state from localStorage fallback (offline mode).
 * @param {string} uid
 * @returns {Object|null}
 */
export const getCachedState = (uid) => {
  try {
    const raw = localStorage.getItem(`cs_state_${uid}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Challenges ───────────────────────────────────────────────────────────────

/**
 * Update challenge progress for the current user.
 * @param {string} uid
 * @param {string} challengeId
 * @param {number} progress — 0–100
 */
export const updateChallenge = async (uid, challengeId, progress) => {
  const ref = doc(db, 'users', uid, 'challenges', challengeId);
  await setDoc(ref, {
    progress,
    active:      progress < 100,
    completedAt: progress >= 100 ? serverTimestamp() : null,
    updatedAt:   serverTimestamp(),
  }, { merge: true });
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────

/**
 * Fetch top-N users sorted by carbonCredits descending.
 * @param {number} topN
 * @returns {Promise<Array<{uid, displayName, carbonCredits, rank}>>}
 */
export const getLeaderboard = async (topN = 20) => {
  // Note: requires a Firestore composite index on carbonCredits (see backend/firestore.indexes.json)
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('carbonCredits', 'desc'),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ uid: d.id, rank: i + 1, ...d.data() }));
};

/**
 * Upsert the user's leaderboard entry after a Sync API commit.
 * @param {string} uid
 * @param {string} displayName
 * @param {number} carbonCredits
 * @param {number} co2Saved
 */
export const updateLeaderboardEntry = async (uid, displayName, carbonCredits, co2Saved) => {
  await setDoc(doc(db, 'leaderboard', uid), {
    displayName,
    carbonCredits,
    co2Saved,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
