/**
 * Wrapper around the toggleHabit mutation that auto-injects
 * the user's timezone so server-side streak calculations
 * use local time instead of UTC.
 */
import { useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { getUserTimezone } from '../utils/timezone';
import { trackFirstHabitCompleted } from '../lib/analytics/onboarding';

export function useToggleHabitWithTimezone() {
  const rawToggle = useMutation(api.habits.toggleHabit);
  const timezone = useMemo(() => getUserTimezone(), []);

  const toggleHabit = useCallback(
    (args: { date: string; habitId: Id<'habits'> }) => {
      // Track first-ever habit completion (fire-and-forget, idempotent)
      void trackFirstHabitCompleted(String(args.habitId));
      return rawToggle({ ...args, timezone });
    },
    [rawToggle, timezone]
  ) as typeof rawToggle;

  return toggleHabit;
}
