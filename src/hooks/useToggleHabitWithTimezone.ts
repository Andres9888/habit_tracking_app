/**
 * Wrapper around the toggleHabit mutation that auto-injects
 * the user's timezone so server-side streak calculations
 * use local time instead of UTC.
 */
import { useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getUserTimezone } from '../utils/timezone';

export function useToggleHabitWithTimezone() {
  const rawToggle = useMutation(api.habits.toggleHabit);
  const timezone = useMemo(() => getUserTimezone(), []);

  const toggleHabit = useCallback(
    (args: { date: string; habitId: any }) =>
      rawToggle({ ...args, timezone }),
    [rawToggle, timezone]
  ) as typeof rawToggle;

  return toggleHabit;
}
