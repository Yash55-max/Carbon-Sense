import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  ignorePatterns: [
    "dist/assets/firebase-auth-*.js",
    "dist/assets/firebase-sdk-core-*.js",
    "dist/assets/firebase-firestore-*.js",
    "dist/assets/firebase-app-*.js"
  ]
} satisfies ReactDoctorConfig;
