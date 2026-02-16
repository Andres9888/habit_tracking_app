import { useCallback, useEffect, useState } from 'react';
import { safeGetBoolean, safeGetString, safeSetBoolean, safeSetString } from '@/utils/storage';

import { ONBOARDING_KEY } from './OnboardingScreen';
import { trackOnboardingEvent } from './analytics';

const ONBOARDING_PROGRESS_KEY = '@chainday_onboarding_progress';

/**
 * Onboarding status hook.
 *
 * CONVERSION-OPTIMIZED: Shows the 3-screen onboarding carousel to new users.
 * The carousel builds desire and sets expectations before users hit the empty state.
 * 
 * Features:
 * - Analytics tracking for each screen
 * - Progress persistence for recovery
 * - "Continue where you left off" on app restart
 */
export function useOnboardingStatus(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [recovered, setRecovered] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      void safeGetBoolean(ONBOARDING_KEY, false)
        .then(async (isComplete) => {
          if (isComplete) {
            // Existing user — already completed onboarding before.
            setComplete(true);
          } else {
            // New user — check if they have in-progress onboarding to recover
            const progressStr = await safeGetString(ONBOARDING_PROGRESS_KEY, '0');
            const progress = parseInt(progressStr, 10) || 0;
            
            if (progress > 0) {
              // User exited during onboarding — enable recovery
              setCurrentScreen(progress);
              setRecovered(true);
              trackOnboardingEvent('onboarding_recovered', {
                recovery_screen: progress,
              });
            } else {
              // Brand new user — start onboarding from beginning
              trackOnboardingEvent('onboarding_started');
            }
            
            setComplete(false);
          }
        })
        .catch((error) => {
          if (__DEV__) console.warn('[useOnboardingStatus] Error reading status:', error);
          // Default to not complete on read error
          setComplete(false);
        });
    }
  }, [isSignedIn]);

  const markComplete = useCallback(async () => {
    try {
      await safeSetBoolean(ONBOARDING_KEY, true);
      // Clear progress tracking
      await safeSetString(ONBOARDING_PROGRESS_KEY, '0');
      setComplete(true);
      
      trackOnboardingEvent('onboarding_completed');
    } catch (error) {
      if (__DEV__) {
        console.warn('[useOnboardingStatus] Error saving completion:', error);
      }
      // Still mark as complete even if save fails
      setComplete(true);
    }
  }, []);

  const saveProgress = useCallback(async (screenIndex: number) => {
    try {
      await safeSetString(ONBOARDING_PROGRESS_KEY, screenIndex.toString());
    } catch (error) {
      if (__DEV__) {
        console.warn('[useOnboardingStatus] Error saving progress:', error);
      }
    }
  }, []);

  return { 
    complete, 
    markComplete,
    currentScreen,
    recovered,
    saveProgress,
  };
}
