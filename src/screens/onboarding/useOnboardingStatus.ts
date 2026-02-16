import { useCallback, useEffect, useState } from 'react';
import { safeGetBoolean, safeSetBoolean } from '@/utils/storage';

import { ONBOARDING_KEY } from './OnboardingScreen';

/**
 * Onboarding status hook.
 *
 * Shows the 3-screen onboarding carousel for new users after sign-up.
 * Existing users who've already completed onboarding skip straight to the app.
 * Onboarding state is persisted in AsyncStorage.
 */
export function useOnboardingStatus(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      void safeGetBoolean(ONBOARDING_KEY, false)
        .then((isComplete) => {
          // Set the actual value from storage
          // New users: false (show onboarding)
          // Existing users: true (skip to app)
          setComplete(isComplete);
        })
        .catch((error) => {
          if (__DEV__) console.warn('[useOnboardingStatus] Error reading status:', error);
          // Default to showing onboarding on read error (safer for new users)
          setComplete(false);
        });
    }
  }, [isSignedIn]);

  const markComplete = useCallback(async () => {
    try {
      await safeSetBoolean(ONBOARDING_KEY, true);
      setComplete(true);
    } catch (error) {
      if (__DEV__) console.warn('[useOnboardingStatus] Error saving completion:', error);
      // Still mark as complete in state even if save fails
      setComplete(true);
    }
  }, []);

  return { complete, markComplete };
}
