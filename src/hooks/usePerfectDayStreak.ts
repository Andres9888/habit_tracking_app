/**
 * usePerfectDayStreak Hook
 *
 * Tracks consecutive "perfect days" — days where ALL habits are completed.
 * Persists streak data to AsyncStorage for cross-session continuity.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalDateString } from '../utils/getLocalDateString';

const STORAGE_KEY = '@perfect_day_streak';

interface PerfectDayData {
  /** Current consecutive perfect day streak */
  currentStreak: number;
  /** Best ever perfect day streak */
  bestStreak: number;
  /** Last date (YYYY-MM-DD) that was a perfect day */
  lastPerfectDate: string | null;
  /** Total perfect days all-time */
  totalPerfectDays: number;
}

const DEFAULT_DATA: PerfectDayData = {
  bestStreak: 0,
  currentStreak: 0,
  lastPerfectDate: null,
  totalPerfectDays: 0,
};

/**
 * Returns the previous date string (YYYY-MM-DD) given a date string
 */
function getPreviousDateString(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

export function usePerfectDayStreak() {
  const [data, setData] = useState<PerfectDayData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            setData(JSON.parse(stored) as PerfectDayData);
          } catch {
            // Corrupted data, reset
          }
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const recordPerfectDay = useCallback(async () => {
    const today = getLocalDateString();

    setData((prev) => {
      // Already recorded today
      if (prev.lastPerfectDate === today) return prev;

      const yesterday = getPreviousDateString(today);
      const isConsecutive = prev.lastPerfectDate === yesterday;

      const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;
      const newBest = Math.max(prev.bestStreak, newStreak);

      const updated: PerfectDayData = {
        bestStreak: newBest,
        currentStreak: newStreak,
        lastPerfectDate: today,
        totalPerfectDays: prev.totalPerfectDays + 1,
      };

      // Persist async (fire and forget)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});

      return updated;
    });
  }, []);

  return {
    bestStreak: data.bestStreak,
    currentStreak: data.currentStreak,
    isLoaded,
    recordPerfectDay,
    totalPerfectDays: data.totalPerfectDays,
  };
}

export default usePerfectDayStreak;
