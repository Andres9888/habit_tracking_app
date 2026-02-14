/**
 * useFirstUsageDate Hook
 *
 * Tracks the first usage date of the app and calculates days since first usage.
 * Used for determining when to show paywall/habit limits.
 */

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_USAGE_DATE_KEY = '@chainday_first_usage_date';

export function useFirstUsageDate() {
  const [daysSinceFirstUsage, setDaysSinceFirstUsage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFirstUsageDate = async () => {
      try {
        const storedDate = await AsyncStorage.getItem(FIRST_USAGE_DATE_KEY);
        const now = new Date();

        if (storedDate) {
          // Calculate days since first usage
          const firstUsageDate = new Date(storedDate);
          const diffMs = now.getTime() - firstUsageDate.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          setDaysSinceFirstUsage(diffDays);
        } else {
          // First time user - set the current date
          const nowISO = now.toISOString();
          await AsyncStorage.setItem(FIRST_USAGE_DATE_KEY, nowISO);
          setDaysSinceFirstUsage(0);
        }
      } catch (error) {
        console.error('Error initializing first usage date:', error);
        // Default to 0 days on error (conservative approach - won't show limit)
        setDaysSinceFirstUsage(0);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeFirstUsageDate();
  }, []);

  return { daysSinceFirstUsage, isLoading };
}
