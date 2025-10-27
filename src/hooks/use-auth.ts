
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null | undefined; // undefined: loading, null: logged out
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const formatUser = (user: FirebaseUser): User => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    isAdmin: false // TODO: Implement admin role management if needed
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(formatUser(firebaseUser));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = { user, login, signup, logout, signInWithGoogle };

  return React.createElement(AuthContext.Provider, { value }, children);
};
