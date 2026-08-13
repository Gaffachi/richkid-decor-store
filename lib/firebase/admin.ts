import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

/**
 * Firebase Admin SDK — server-only. Never import this from a Client Component.
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
 * from a service-account key (Firebase Console > Project Settings > Service Accounts).
 */
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys are stored in env files with literal "\n" sequences.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
