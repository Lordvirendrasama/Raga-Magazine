
'use server';

import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import config from '@/lib/firebase/config';

let app: App;
if (!admin.apps.length) {
  if (config.projectId && config.clientEmail && config.privateKey) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // Throwing an error here to make it clear that initialization failed.
      throw new Error('Firebase admin initialization failed');
    }
  } else {
    console.error('Firebase credentials are not set in the environment.');
    // Throwing an error here as well.
    throw new Error('Firebase credentials are not set in the environment.');
  }
} else {
    app = admin.apps[0] as App;
}


const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
