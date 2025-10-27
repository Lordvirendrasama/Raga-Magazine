
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStreak } from '@/hooks/use-streak';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const StreakPopup = () => {
  const { user } = useAuth();
  const { streak, title, message } = useStreak();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (streak > 0 && typeof window !== 'undefined') {
      const userIdentifier = user ? user.uid : 'guest';
      const sessionKey = `streak-popup-session-${userIdentifier}`;
      const hasSeenPopup = sessionStorage.getItem(sessionKey);
      
      if (!hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [user, streak]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  const headerTitle = user ? `Welcome back, ${user.name}!` : 'Welcome back!';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">
            {headerTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            You're on a <span className="font-bold text-primary">{streak}-day streak!</span>
          </DialogDescription>
        </DialogHeader>
        <div className="text-center my-4">
          <p className="text-4xl">🔥</p>
          <p className="mt-2 text-muted-foreground">{message}</p>
          <p className="mt-4 font-bold text-accent text-xl">You are a {title}!</p>
        </div>
        <div className="flex justify-center">
            <Button onClick={handleClose}>Keep Reading</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StreakPopup;
