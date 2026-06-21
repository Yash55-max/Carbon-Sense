/**
 * CarbonProtocolContext
 * Centralized state pipeline for all carbon scores, user data, and app actions.
 * Uses useReducer for predictable state transitions, with Firestore sync via Sync API.
 */

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { calcTotalFootprint, generateMockHistory } from '../utils/carbonEngine';
import { getUserState, saveUserState, getCachedState, updateLeaderboardEntry } from '../firebase/db';

// ─── Initial State ────────────────────────────────────────────────────────────

/** National average monthly footprint baseline (kg CO₂e). Source: IEA 2023 */
const NATIONAL_BASELINE_KG = 560;

const INITIAL_STATE = {
  // User
  user:              null,       // Firebase Auth user object
  userProfile:       null,       // Firestore profile { displayName, rank, carbonCredits }

  // Carbon data
  monthlyFootprint:  320,        // kg CO2e (aligned with initial activities: 42+185+68+25 = 320)
  streakDays:        14,
  activities: {
    transit:   42,
    energy:    185,
    food:      68,
    shopping:  25,
  },
  draftActivities: {
    transit:   42,
    energy:    185,
    food:      68,
    shopping:  25,
  },
  unlockedBadges:    ['EARLY_ADOPTER', 'CARBON_SINK'],
  history:           [],         // populated from Firestore or mock

  // Challenges
  challenges: [
    { id: 'no_drive',   title: 'No-Drive Mode',     progress: 70, duration: '7-Day Streak',   description: 'Eliminate transit-related CO2 emissions for 168 consecutive hours.', icon: 'car', active: true },
    { id: 'grid_shift', title: 'Grid Shift',         progress: 30, duration: 'Community Goal', description: 'Collective reduction of peak-hour energy usage across the network.',  icon: 'zap', active: true },
    { id: 'smart_meter',title: 'Smart Meter Sync',   progress: 15, duration: 'Hardware Link',  description: 'Integrate local IoT sensors for real-time data precision metrics.',   icon: 'wifi', active: true, priority: true },
  ],

  // UI state
  isSyncing:      false,
  syncSuccess:    false,
  isLoading:      true,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

export const ACTIONS = {
  SET_USER:           'SET_USER',
  SET_USER_PROFILE:   'SET_USER_PROFILE',
  SET_STATE:          'SET_STATE',
  UPDATE_ACTIVITIES:  'UPDATE_ACTIVITIES',
  UPDATE_DRAFT_ACTIVITIES: 'UPDATE_DRAFT_ACTIVITIES',
  TOGGLE_BADGE:       'TOGGLE_BADGE',
  UPDATE_CHALLENGE:   'UPDATE_CHALLENGE',
  TOGGLE_HABIT:       'TOGGLE_HABIT',
  SYNC_START:         'SYNC_START',
  SYNC_SUCCESS:       'SYNC_SUCCESS',
  SYNC_ERROR:         'SYNC_ERROR',
  SYNC_RESET_SUCCESS: 'SYNC_RESET_SUCCESS',
  SET_LOADING:        'SET_LOADING',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };

    case ACTIONS.SET_STATE: {
      const newState = { ...state, ...action.payload };
      const totalKg  = calcTotalFootprint(newState.activities);
      const activities = newState.activities;
      return {
        ...newState,
        monthlyFootprint: totalKg,
        draftActivities: { ...activities }
      };
    }

    case ACTIONS.UPDATE_ACTIVITIES: {
      const activities = { ...state.activities, ...action.payload };
      const monthlyFootprint = calcTotalFootprint(activities);
      return {
        ...state,
        activities,
        draftActivities: { ...activities },
        monthlyFootprint
      };
    }

    case ACTIONS.UPDATE_DRAFT_ACTIVITIES: {
      const draftActivities = { ...state.draftActivities, ...action.payload };
      return { ...state, draftActivities };
    }

    case ACTIONS.TOGGLE_BADGE: {
      const badge = action.payload;
      const has   = state.unlockedBadges.includes(badge);
      return {
        ...state,
        unlockedBadges: has
          ? state.unlockedBadges.filter(b => b !== badge)
          : [...state.unlockedBadges, badge],
      };
    }

    case ACTIONS.UPDATE_CHALLENGE: {
      const challenges = state.challenges.map(c =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      );
      return { ...state, challenges };
    }

    case ACTIONS.SYNC_START:
      return { ...state, isSyncing: true, syncSuccess: false };

    case ACTIONS.SYNC_SUCCESS:
      return { ...state, isSyncing: false, syncSuccess: true };

    case ACTIONS.SYNC_ERROR:
      return { ...state, isSyncing: false, syncSuccess: false };

    case ACTIONS.SYNC_RESET_SUCCESS:
      return { ...state, syncSuccess: false };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CarbonProtocolContext = createContext(null);

export function CarbonProtocolProvider({ children, initialUser = null, initialProfile = null, skipLoad = false }) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    user:        initialUser,
    userProfile: initialProfile,
    history:     generateMockHistory(320), // Aligned with aligned base footprint
  });

  // ── Load user state from Firestore when auth user changes ──────────────────
  const user = state.user;
  useEffect(() => {
    let active = true;
    if (!user || skipLoad) return;

    const load = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const remote = await getUserState(user.uid);
        if (!active) return;
        if (remote) {
          dispatch({ type: ACTIONS.SET_STATE, payload: {
            ...remote,
            history: remote.history?.length ? remote.history : generateMockHistory(remote.monthlyFootprint ?? 320),
          }});
        } else {
          // First-time user — use default state with mock history
          const cached = getCachedState(user.uid);
          if (cached && active) dispatch({ type: ACTIONS.SET_STATE, payload: cached });
        }
      } catch (err) {
        // Firestore unavailable — fall back to localStorage cache
        const cached = getCachedState(user.uid);
        if (cached && active) dispatch({ type: ACTIONS.SET_STATE, payload: cached });
        console.warn('Firestore unavailable, using cached state:', err.message);
      } finally {
        if (active) {
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user, skipLoad]);

  // ── Sync API — commit state to Firestore ───────────────────────────────────
  const syncToFirestore = useCallback(async () => {
    if (!state.user || state.isSyncing) return;
    dispatch({ type: ACTIONS.SYNC_START });
    try {
      await saveUserState(state.user.uid, state);
      
      const co2Saved = Math.max(0, 560 - state.monthlyFootprint);
      const completedChallengesCount = state.challenges.filter(c => c.progress >= 100).length;
      const carbonCredits = co2Saved * 50 + completedChallengesCount * 10000;

      await updateLeaderboardEntry(
        state.user.uid,
        state.user.displayName ?? 'Anonymous',
        carbonCredits,
        co2Saved,
      );
      dispatch({ type: ACTIONS.SYNC_SUCCESS });
    } catch (err) {
      console.error('Sync failed:', err);
      dispatch({ type: ACTIONS.SYNC_ERROR });
    }
  }, [state]);

  const value = { state, dispatch, syncToFirestore, ACTIONS };

  return (
    <CarbonProtocolContext.Provider value={value}>
      {children}
    </CarbonProtocolContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCarbonProtocol() {
  const ctx = useContext(CarbonProtocolContext);
  if (!ctx) throw new Error('useCarbonProtocol must be used inside CarbonProtocolProvider');
  return ctx;
}

export { NATIONAL_BASELINE_KG };
