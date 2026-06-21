import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('src/firebase/firebaseConfigObject.js') ||
            id.includes('src/firebase/firebaseConfig.js')
          ) {
            return 'firebase-config';
          }
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
