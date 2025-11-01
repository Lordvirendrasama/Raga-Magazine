
'use server';

import * as admin from 'firebase-admin';

// This is a workaround for the Vercel deployment environment.
// The private key is not correctly parsed from the .env file.
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    privateKey
  ) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      throw new Error('Firebase admin initialization failed.');
    }
  } else {
    // We can't initialize without credentials, so we'll throw an error.
    throw new Error('Firebase credentials are not set in the environment.');
  }
}

const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
