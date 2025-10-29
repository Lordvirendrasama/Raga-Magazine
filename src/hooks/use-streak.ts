
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './use-auth';
import { getFirebaseApp } from '@/lib/firebaseconfig';
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';


// Helper to get date in YYYY-MM-DD format
const getLocalDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface StreakData {
  streak: number;
  lastVisit: string;
}

export const useStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    const app = getFirebaseApp();
    if (app) {
      setDb(getFirestore(app));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || user === undefined) {
      // Don't run on server or while auth is loading
      return;
    }
    
    const GUEST_STREAK_KEY = 'raga-guest-streak';

    const processStreak = (currentData: StreakData | undefined): StreakData => {
        const todayStr = getLocalDate(new Date());
        const { streak: currentStreak = 0, lastVisit = '' } = currentData || { streak: 0, lastVisit: '' };

        if (lastVisit === todayStr) {
            return { streak: currentStreak, lastVisit };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDate(yesterday);
        
        const newStreak = (lastVisit === yesterdayStr) ? currentStreak + 1 : 1;
        
        return { streak: newStreak, lastVisit: todayStr };
    };

    const updateStreak = async () => {
        try {
            if (user && db) {
                // Logged-in user logic (Firestore)
                const streakRef = doc(db, 'streaks', user.uid);
                const streakSnap = await getDoc(streakRef);
                const currentData = streakSnap.data() as StreakData | undefined;
                
                const newStreakData = processStreak(currentData);
                setStreak(newStreakData.streak);

                await setDoc(streakRef, newStreakData, { merge: true });

            } else {
                // Guest user logic (localStorage)
                const guestStreakStr = localStorage.getItem(GUEST_STREAK_KEY);
                const guestStreakData = guestStreakStr ? JSON.parse(guestStreakStr) : undefined;
                
                const newGuestStreakData = processStreak(guestStreakData);
                setStreak(newGuestStreakData.streak);

                localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(newGuestStreakData));
            }
        } catch (error) {
            console.error('Failed to process streak data:', error);
            setStreak(0); // Reset on error
        }
    };

    updateStreak();

  }, [user, db]);

  const { title, message } = useMemo(() => {
    if (streak >= 30) {
      return {
        title: "Tala Titan",
        message: "Your dedication is legendary! You have achieved the highest honor.",
      };
    }
    if (streak >= 15) {
      return {
        title: "Nada Ninja",
        message: "You move through melodies with silent skill. A true master of sound.",
      };
    }
    if (streak >= 7) {
      return {
        title: "Swara Scholar",
        message: "Your devotion to Indian music is unmatched — you're becoming a true Raga Genius!",
      };
    }
    if (streak >= 3) {
      return {
        title: "Raga Regular",
        message: "You're building a great habit! Keep exploring the world of ragas.",
      };
    }
    return {
      title: "Newcomer",
      message: "Welcome! Your journey into the world of Indian classical music begins.",
    };
  }, [streak]);


  return { streak, title, message };
};
