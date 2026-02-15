
import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ONBOARDING_KEY } from './OnboardingScreen';

/**
 * Onboarding status hook.
 *
 * Auto-completes onboarding for new users so they land directly on the
 * habit creation empty state — the empty state IS the onboarding.
 * The old 3-screen carousel was skipped by most users; this removes
 * the friction entirely.
 */
export function useOnboardingStatus(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      void AsyncStorage.getItem(ONBOARDING_KEY)
        .then((value) => {
          if (value === 'true') {
            // Existing user — already completed onboarding before.
            setComplete(true);
          } else {
            // New user — auto-complete onboarding, skip the carousel.
            void AsyncStorage.setItem(ONBOARDING_KEY, 'true')
              .then(() => {
                setComplete(true);
              })
              .catch((error) => {
                if (__DEV__) console.warn('Error saving onboarding status:', error);
                // Still mark as complete even if save fails
                setComplete(true);
              });
          }
        })
        .catch((error) => {
          if (__DEV__) console.warn('Error reading onboarding status:', error);
          // Default to not complete on read error
          setComplete(false);
        });
    }
  }, [isSignedIn]);

  const markComplete = useCallback(() => {
    setComplete(true);
  }, []);

  return { complete, markComplete };
}
