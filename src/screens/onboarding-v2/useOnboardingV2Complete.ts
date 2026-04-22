import { useCallback, useEffect, useState } from 'react';
import { safeGetBoolean, safeSetBoolean } from '@/utils/storage';

import { ONBOARDING_V2_COMPLETE_KEY } from './storageKeys';

/**
 * Tracks whether the user has finished the Chain Builder onboarding (v2).
 *
 * Does NOT auto-complete for new users — v2 is a real flow, not a bypass.
 */
export function useOnboardingV2Complete(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setComplete(null);
      return;
    }
    void safeGetBoolean(ONBOARDING_V2_COMPLETE_KEY, false)
      .then(setComplete)
      .catch(() => setComplete(false));
  }, [isSignedIn]);

  const markComplete = useCallback(() => {
    setComplete(true);
    void safeSetBoolean(ONBOARDING_V2_COMPLETE_KEY, true).catch(() => {});
  }, []);

  return { complete, markComplete };
}
