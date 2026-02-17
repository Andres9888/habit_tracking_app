import { useCallback, useEffect, useState } from 'react';
import { safeGetBoolean } from '@/utils/storage';

import { ONBOARDING_KEY } from './OnboardingScreen';

/**
 * Onboarding status hook.
 *
 * Shows the animated 3-screen onboarding for new users.
 * Reads AsyncStorage to determine if onboarding was already completed.
 */
export function useOnboardingStatus(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      void safeGetBoolean(ONBOARDING_KEY, false)
        .then((isComplete) => {
          setComplete(isComplete);
        })
        .catch((error) => {
          if (__DEV__) console.warn('[useOnboardingStatus] Error reading status:', error);
          // Default to not complete on read error — show onboarding
          setComplete(false);
        });
    }
  }, [isSignedIn]);

  const markComplete = useCallback(() => {
    setComplete(true);
  }, []);

  return { complete, markComplete };
}
