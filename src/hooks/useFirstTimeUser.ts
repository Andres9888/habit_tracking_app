/**
 * useFirstTimeUser - Hook to track first-time user state
 *
 * Returns whether the user is new (hasn't created a habit yet),
 * whether tooltips should show, and functions to dismiss them.
 *
 * Created by Opus.
 */

import { useCallback, useEffect, useState } from 'react';

import {
  hasSeenSuggestedHabits,
  hasSeenTooltips,
  isFirstTimeUser,
  markSuggestedHabitsSeen,
  markTooltipsSeen,
} from '../lib/analytics/onboarding';

interface FirstTimeUserState {
  isFirstTime: boolean | null; // null = loading
  showTooltips: boolean;
  showSuggestedHabits: boolean;
  dismissTooltips: () => void;
  dismissSuggestedHabits: () => void;
}

export function useFirstTimeUser(): FirstTimeUserState {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [showTooltips, setShowTooltips] = useState(false);
  const [showSuggestedHabits, setShowSuggestedHabits] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [firstTime, seenTooltips, seenSuggested] = await Promise.all([
        isFirstTimeUser(),
        hasSeenTooltips(),
        hasSeenSuggestedHabits(),
      ]);
      if (cancelled) return;
      setIsFirstTime(firstTime);
      setShowTooltips(firstTime && !seenTooltips);
      setShowSuggestedHabits(firstTime && !seenSuggested);
    })();
    return () => { cancelled = true; };
  }, []);

  const dismissTooltips = useCallback(() => {
    setShowTooltips(false);
    void markTooltipsSeen();
  }, []);

  const dismissSuggestedHabits = useCallback(() => {
    setShowSuggestedHabits(false);
    void markSuggestedHabitsSeen();
  }, []);

  return {
    isFirstTime,
    showTooltips,
    showSuggestedHabits,
    dismissTooltips,
    dismissSuggestedHabits,
  };
}
