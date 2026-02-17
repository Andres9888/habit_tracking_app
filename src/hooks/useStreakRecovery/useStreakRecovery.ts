/**
 * useStreakRecovery — Hook for streak recovery feature
 *
 * Provides recovery status (used/remaining this month) and a
 * mutation to recover a broken streak for a specific habit + missed date.
 */

import { useCallback, useState } from 'react';

import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

import { getUserTimezone } from '../../utils/timezone';

export function useStreakRecovery() {
  const timezone = getUserTimezone();
  const status = useQuery(api.streakRecovery.getRecoveryStatus, { timezone });
  const recoverMutation = useMutation(api.streakRecovery.recoverStreak);
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recover = useCallback(
    async (habitId: Id<'habits'>, missedDate: string) => {
      setIsRecovering(true);
      setError(null);
      try {
        const result = await recoverMutation({
          habitId,
          missedDate,
          timezone,
        });
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Recovery failed';
        setError(message);
        throw err;
      } finally {
        setIsRecovering(false);
      }
    },
    [recoverMutation, timezone]
  );

  return {
    /** Error message from last recovery attempt */
    error,
    /** Whether user has premium */
    isPremium: status?.isPremium ?? false,
    /** Whether a recovery is in progress */
    isRecovering,
    /** Monthly limit */
    limit: status?.limit ?? 1,
    /** Perform recovery */
    recover,
    /** Recoveries remaining this month */
    remaining: status?.remaining ?? 0,
    /** Loading state */
    status,
    /** Recoveries used this month */
    used: status?.used ?? 0,
  };
}
