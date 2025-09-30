
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MuteContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const MuteContext = createContext<MuteContextType | undefined>(undefined);

export const useMute = () => {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error('useMute must be used within a MuteProvider');
  }
  return context;
};

export const MuteProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return React.createElement(MuteContext.Provider, { value: { isMuted, toggleMute } }, children);
};
