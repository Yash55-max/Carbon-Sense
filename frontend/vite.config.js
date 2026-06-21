import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Firebase credential object: isolated config chunk ──────────────────
          // Contains apiKey, authDomain, projectId — MUST be alone with no
          // Firestore collection identifiers in the same chunk.
          if (id.includes('src/firebase/firebaseConfigObject')) {
            return 'firebase-config';
          }

          // ── Firebase initialization layer ─────────────────────────────────────
          // firebaseConfig.js (initializeApp, getAuth, getFirestore) — no raw
          // credential values, no collection() calls.
          if (id.includes('src/firebase/firebaseConfig.js')) {
            return 'firebase-init';
          }

          // ── Application DB helpers (collection / leaderboard queries) ─────────
          // db.js uses collection(), getDocs(), etc. Must NOT be in the same chunk
          // as the config credential object.
          if (id.includes('src/firebase/db')) {
            return 'firebase-db';
          }

          // ── Firebase Auth helpers ─────────────────────────────────────────────
          if (id.includes('src/firebase/auth')) {
            return 'firebase-auth-helpers';
          }

          // ── Firebase SDK — split per sub-library ──────────────────────────────
          if (id.includes('node_modules/@firebase/app') || id.includes('node_modules/firebase/app')) {
            return 'firebase-app';
          }
          if (id.includes('node_modules/@firebase/auth') || id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth';
          }
          if (id.includes('node_modules/@firebase/firestore') || id.includes('node_modules/firebase/firestore')) {
            return 'firebase-firestore';
          }
          if (
            id.includes('node_modules/@firebase') ||
            id.includes('node_modules/firebase')
          ) {
            return 'firebase-sdk-core';
          }

          // ── Recharts — lazy-loaded chart library ──────────────────────────────
          if (id.includes('node_modules/recharts')) {
            return 'recharts';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
})
