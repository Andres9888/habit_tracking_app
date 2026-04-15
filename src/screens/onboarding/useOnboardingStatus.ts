import { useCallback, useEffect, useState } from 'react';
import { safeGetBoolean, safeSetBoolean } from '@/utils/storage';

import { ONBOARDING_KEY } from './onboarding.data';

/**
 * Onboarding status hook.
 *
 * New users see the interactive onboarding flow (add a habit, try completing it,
 * celebrate). Returning users who already completed onboarding skip to the app.
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
          setComplete(false);
        });
    }
  }, [isSignedIn]);

  const markComplete = useCallback(() => {
    setComplete(true);
  }, []);

  return { complete, markComplete };
}
