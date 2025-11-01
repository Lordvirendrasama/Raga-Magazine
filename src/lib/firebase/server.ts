
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
    // Re-throwing the error is important so we don't proceed with a broken state
    throw new Error('Firebase admin initialization failed.');
  }
}

// These are now guaranteed to be initialized if no error was thrown.
const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
