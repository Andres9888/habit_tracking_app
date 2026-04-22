import { useCallback } from 'react';
import { safeSetBoolean } from '@/utils/storage';

import { ONBOARDING_V2_COMPLETE_KEY } from './storageKeys';

/**
 * Tracks whether the user has finished the Chain Builder onboarding (v2).
 *
 * DEV/REVIEW MODE: always reports incomplete when signed in so the
 * onboarding shows every launch. Restore the AsyncStorage read below
 * to go back to normal persisted behavior.
 */
export function useOnboardingV2Complete(isSignedIn: boolean) {
  const complete = isSignedIn ? false : null;

  const markComplete = useCallback(() => {
    void safeSetBoolean(ONBOARDING_V2_COMPLETE_KEY, true).catch(() => {});
  }, []);

  return { complete, markComplete };
}
