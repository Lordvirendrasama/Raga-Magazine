
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './use-auth';

const USER_STORAGE_KEY = 'raga-users';
const GUEST_STREAK_KEY = 'raga-guest-streak';

// Helper to get date in YYYY-MM-DD format for IST
const getISTDate = (date: Date): string => {
  const utcOffset = 5.5 * 60; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + utcOffset * 60 * 1000);
  return istDate.toISOString().split('T')[0];
};

interface StreakData {
  streak: number;
  lastVisit: string;
}

export const useStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const todayStr = getISTDate(new Date());
    let newStreak: number;

    const processStreak = (currentData: StreakData | undefined): StreakData => {
        const { streak: currentStreak = 0, lastVisit = '' } = currentData || { streak: 0, lastVisit: '' };

        if (lastVisit === todayStr) {
            newStreak = currentStreak; // Visited today already
            return { streak: newStreak, lastVisit };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getISTDate(yesterday);

        if (lastVisit === yesterdayStr) {
            newStreak = currentStreak + 1; // Consecutive visit
        } else {
            newStreak = 1; // Missed a day or first visit
        }
        
        return { streak: newStreak, lastVisit: todayStr };
    };

    try {
      if (user) {
        // Logged-in user logic
        const usersStr = localStorage.getItem(USER_STORAGE_KEY);
        const users = usersStr ? JSON.parse(usersStr) : {};
        const userData = users[user.name] || {};
        
        const newStreakData = processStreak(userData.streakData);
        setStreak(newStreakData.streak);

        users[user.name] = { ...userData, streakData: newStreakData };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
      } else {
        // Guest user logic
        const guestStreakStr = localStorage.getItem(GUEST_STREAK_KEY);
        const guestStreakData = guestStreakStr ? JSON.parse(guestStreakStr) : undefined;
        
        const newGuestStreakData = processStreak(guestStreakData);
        setStreak(newGuestStreakData.streak);

        localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(newGuestStreakData));
      }
    } catch (error) {
      console.error('Failed to process streak data:', error);
      setStreak(0);
    }
  }, [user]);

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
