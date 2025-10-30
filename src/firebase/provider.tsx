
'use client';

import {
  createContext,
  useContext,
} from 'react';

import {
  FirebaseApp
} from 'firebase/app';
import {
  Auth
} from 'firebase/auth';
import {
  Firestore
} from 'firebase/firestore';

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

/**
 * Hook to get the Firebase instances.
 * @throws an error if used outside of a FirebaseProvider.
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider that has a value. This could mean Firebase is not initialized on the client.');
  }
  return context;
}

export function useAuth() {
  const { auth } = useFirebase();
  return { auth };
}
