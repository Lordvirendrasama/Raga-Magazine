
'use client';

import React, { useState, ReactNode, useRef, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Music } from 'lucide-react';

export interface MuteContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

export const MuteContext = createContext<MuteContextType | undefined>(undefined);

export const useMute = () => {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error('useMute must be used within a MuteProvider');
  }
  return context;
};

export const MuteProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();
  const hasShownToastRef = useRef(false);

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMutedState = !prev;
      if (!newMutedState && !hasShownToastRef.current) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span>Easter Egg Found!</span>
            </div>
          ),
          description: "You've unmuted the site. Hover over links to hear one of india's most influential music.",
        });
        hasShownToastRef.current = true;
      }
      return newMutedState;
    });
  };

  return React.createElement(MuteContext.Provider, { value: { isMuted, toggleMute } }, children);
};
