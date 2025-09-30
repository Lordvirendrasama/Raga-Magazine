
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const USER_STORAGE_KEY = 'raga-users';

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, pass: string) => void;
  signup: (name: string, pass: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if a user is logged in from a previous session
    const loggedInUser = sessionStorage.getItem('raga-loggedInUser');
    if (loggedInUser) {
      setUser({ name: loggedInUser });
    }
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  const login = (name: string, pass: string) => {
    const users = getUsers();
    if (users[name] && users[name].password === pass) {
      setUser({ name });
      sessionStorage.setItem('raga-loggedInUser', name);
    } else {
      throw new Error('Invalid name or password.');
    }
  };

  const signup = (name: string, pass: string) => {
    const users = getUsers();
    if (users[name]) {
      throw new Error('User already exists. Please log in.');
    }
    users[name] = { password: pass, streakData: { streak: 0, lastVisit: '' } };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    setUser({ name });
    sessionStorage.setItem('raga-loggedInUser', name);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('raga-loggedInUser');
  };

  const value = { user, login, signup, logout };

  return React.createElement(AuthContext.Provider, { value }, children);
};
