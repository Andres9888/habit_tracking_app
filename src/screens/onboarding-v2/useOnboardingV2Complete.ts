import { useCallback, useEffect, useState } from 'react';
import { safeSetBoolean } from '@/utils/storage';

import { FEATURE_FLAGS } from '../../constants/featureFlags';
import { ONBOARDING_V2_COMPLETE_KEY } from './storageKeys';

/**
 * Tracks whether the user has finished the Chain Builder onboarding (v2).
 *
 * DEV/REVIEW MODE: ignores the AsyncStorage flag on launch, so the
 * onboarding shows every app open. Within a session, calling
 * `markComplete()` still flips state to true so the user can finish
 * the flow and reach HabitsApp — on the next launch they see
 * onboarding again. Restore the `safeGetBoolean` read to go back to
 * normal persisted behavior.
 */
export function useOnboardingV2Complete(isSignedIn: boolean) {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setComplete(null);
      return;
    }

    if (!FEATURE_FLAGS.ONBOARDING_V2_ENABLED) {
      setComplete(true);
      return;
    }

    setComplete(false);
  }, [isSignedIn]);

  const markComplete = useCallback(() => {
    setComplete(true);
    void safeSetBoolean(ONBOARDING_V2_COMPLETE_KEY, true).catch(() => {});
  }, []);

  return { complete, markComplete };
}
