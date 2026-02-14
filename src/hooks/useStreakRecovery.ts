/**
 * useStreakRecovery - Hook to check for streak freeze eligibility on app open
 *
 * Queries the backend for habits with broken streaks that can be recovered,
 * and provides state for showing the StreakRecoveryModal.
 */

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

// Get user's timezone
function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
}

export function useStreakRecovery() {
  const timezone = getUserTimezone();
  const recoveryStatus = useQuery(api.streakFreeze.getStreakRecoveryStatus, {
    timezone,
  });
  const useFreezeMutation = useMutation(api.streakFreeze.useStreakFreeze);

  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when new recovery data comes in
  // (e.g., navigating back to app)
  useEffect(() => {
    if (recoveryStatus) {
      setDismissed(false);
    }
  }, [recoveryStatus?.eligibleHabits?.length]);

  const visible =
    !dismissed &&
    recoveryStatus != null &&
    recoveryStatus.eligibleHabits.length > 0;

  const handleUseFreeze = useCallback(
    async (habitId: string) => {
      await useFreezeMutation({
        habitId: habitId as Id<'habits'>,
        timezone,
      });
    },
    [useFreezeMutation, timezone]
  );

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  return {
    eligibleHabits: recoveryStatus?.eligibleHabits ?? [],
    freezesRemaining: recoveryStatus?.freezesRemaining ?? 0,
    handleDismiss,
    handleUseFreeze,
    visible,
  };
}
