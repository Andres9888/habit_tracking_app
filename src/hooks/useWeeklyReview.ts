/**
 * useWeeklyReview Hook
 *
 * Manages the weekly review card visibility, data fetching, and notification scheduling.
 * Shows the review card on Sunday evening and Monday (all day).
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery } from 'convex/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '../../convex/_generated/api';
import { usePremium } from './usePremium/usePremium';
import { scheduleWeeklyReviewNotification } from '../utils/notifications/weeklyReview';

const DISMISSED_KEY = 'weekly-review-dismissed';

/**
 * Get the Monday of the most recent completed week.
 * If today is Sunday (after 5 PM) or Monday, return last Monday.
 * Otherwise return null (not review time).
 */
function getReviewWeekStart(): { weekStart: string; shouldShow: boolean } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const hour = now.getHours();

  // Show on Sunday evening (after 5 PM) or all day Monday
  const isSundayEvening = dayOfWeek === 0 && hour >= 17;
  const isMonday = dayOfWeek === 1;

  if (!isSundayEvening && !isMonday) {
    // Still compute the week start for prefetching but don't show
    const daysBack = dayOfWeek === 0 ? 7 : dayOfWeek + 6;
    const monday = new Date(now);
    monday.setDate(monday.getDate() - daysBack);
    return {
      weekStart: monday.toISOString().split('T')[0],
      shouldShow: false,
    };
  }

  // The review covers the week that just ended
  // If Sunday evening: the week Mon–Sun that's ending today
  // If Monday: the week Mon–Sun that ended yesterday
  const daysBack = dayOfWeek === 0 ? 6 : 7; // Sun: go back 6 to last Mon; Mon: go back 7
  const monday = new Date(now);
  monday.setDate(monday.getDate() - daysBack);

  return {
    weekStart: monday.toISOString().split('T')[0],
    shouldShow: true,
  };
}

export function useWeeklyReview() {
  const { isPremium } = usePremium();
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { weekStart, shouldShow } = useMemo(() => getReviewWeekStart(), []);

  // Check if already dismissed for this week
  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_KEY).then((val) => {
      if (val === weekStart) {
        setDismissed(true);
      }
      setLoaded(true);
    });
  }, [weekStart]);

  // Schedule the weekly notification on mount
  useEffect(() => {
    scheduleWeeklyReviewNotification();
  }, []);

  // Fetch review data
  const review = useQuery(api.weeklyReview.getWeeklyReview, {
    weekStartDate: weekStart,
    isPremium,
  });

  const dismiss = useCallback(async () => {
    setDismissed(true);
    await AsyncStorage.setItem(DISMISSED_KEY, weekStart);
  }, [weekStart]);

  return {
    review,
    isVisible: loaded && shouldShow && !dismissed && review != null,
    dismiss,
    isPremium,
  };
}
