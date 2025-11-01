
'use server';

import * as admin from 'firebase-admin';
import config from '@/lib/firebase/config';

if (!admin.apps.length) {
  if (config.projectId && config.clientEmail && config.privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  } else {
    console.error('Firebase credentials are not set in the environment.');
  }
}

const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
