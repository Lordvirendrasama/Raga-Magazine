
'use server';

import * as admin from 'firebase-admin';
import 'dotenv/config';

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error('Firebase credentials are not set in the environment. Please check your .env file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const firestore = admin.apps.length ? admin.firestore() : undefined;
export const auth = admin.apps.length ? admin.auth() : undefined;

if (firestore === undefined || auth === undefined) {
    console.error("Firestore or Auth are not initialized because Firebase Admin SDK failed to initialize.");
}
