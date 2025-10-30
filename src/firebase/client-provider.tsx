
'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import {
  FirebaseApp,
  FirebaseOptions,
  initializeApp,
} from 'firebase/app';
import {
  Auth,
  getAuth,
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
} from 'firebase/firestore';

import { FirebaseContext } from './provider';

export interface FirebaseClientProviderProps {
  children: ReactNode;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [instances, setInstances] = useState<FirebaseInstances | undefined>();

  useEffect(() => {
    if (
      !instances &&
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId
    ) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      setInstances({
        app,
        auth,
        firestore,
      });
    }
  }, [instances]);

  if (!instances) {
    // Render nothing until Firebase is initialized on the client.
    // Children that depend on Firebase (like UserNav) have their own loading states.
    return <>{children}</>;
  }
  
  return (
    <FirebaseContext.Provider value={instances}>
      {children}
    </FirebaseContext.Provider>
  );
}
