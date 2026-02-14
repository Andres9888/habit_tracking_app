/**
 * Morning Check-in Hook
 *
 * Handles the logic for determining whether to show the morning check-in screen:
 * - Checks if current time is between 6-10am
 * - Tracks if check-in was already shown today (using AsyncStorage)
 * - Provides dismiss functionality
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MORNING_CHECKIN_DISMISSED_KEY = 'morning_checkin_dismissed';

const MORNING_START_HOUR = 6;
const MORNING_END_HOUR = 10;

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function isMorningTime(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= MORNING_START_HOUR && hour < MORNING_END_HOUR;
}

export interface UseMorningCheckinResult {
  shouldShowCheckin: boolean;
  isLoading: boolean;
  dismissCheckin: () => Promise<void>;
  checkinData: MorningCheckinData | null;
}

export interface MorningCheckinData {
  yesterdaySummary: {
    completed: number;
    total: number;
    percentage: number;
  };
  todayHabits: {
    id: string;
    name: string;
    emoji: string;
    completed: boolean;
  }[];
  motivationalMessage: {
    text: string;
    author: string;
  };
}

export function useMorningCheckin(
  yesterdayData: { completed: number; total: number } | null,
  todayHabits: { id: string; name: string; emoji: string; completed: boolean }[]
): UseMorningCheckinResult {
  const [shouldShowCheckin, setShouldShowCheckin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkShouldShowCheckin();
  }, []);

  const checkShouldShowCheckin = async () => {
    try {
      // Check if it's morning time
      if (!isMorningTime()) {
        setShouldShowCheckin(false);
        setIsLoading(false);
        return;
      }

      // Check if already dismissed today
      const todayKey = getTodayDateString();
      const storageKey = `${MORNING_CHECKIN_DISMISSED_KEY}_${todayKey}`;
      const dismissedValue = await AsyncStorage.getItem(storageKey);

      if (dismissedValue === 'true') {
        setShouldShowCheckin(false);
      } else {
        setShouldShowCheckin(true);
      }
    } catch (error) {
      console.error('Error checking morning checkin status:', error);
      setShouldShowCheckin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissCheckin = useCallback(async () => {
    try {
      const todayKey = getTodayDateString();
      const storageKey = `${MORNING_CHECKIN_DISMISSED_KEY}_${todayKey}`;
      await AsyncStorage.setItem(storageKey, 'true');
      setShouldShowCheckin(false);
    } catch (error) {
      console.error('Error dismissing morning checkin:', error);
    }
  }, []);

  // Build checkin data
  const checkinData: MorningCheckinData | null = yesterdayData && todayHabits.length > 0
    ? {
        yesterdaySummary: {
          completed: yesterdayData.completed,
          total: yesterdayData.total,
          percentage: yesterdayData.total > 0
            ? Math.round((yesterdayData.completed / yesterdayData.total) * 100)
            : 0,
        },
        todayHabits,
        motivationalMessage: getRandomMotivation(),
      }
    : null;

  return {
    shouldShowCheckin: shouldShowCheckin && checkinData !== null,
    isLoading,
    dismissCheckin,
    checkinData,
  };
}

// Get a random motivational message
function getRandomMotivation(): { text: string; author: string } {
  const messages = [
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "You'll never change your life until you change something you do daily.", author: "John C. Maxwell" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Progress, not perfection.", author: "Unknown" },
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
