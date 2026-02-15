/**
 * Wrapper hook around the toggleHabit mutation that automatically injects
 * the user's timezone so server-side streak calculations use local time
 * instead of UTC.
 *
 * @returns Toggle function that accepts date and habitId
 *
 * @example
 * ```ts
 * const toggleHabit = useToggleHabitWithTimezone();
 * await toggleHabit({ date: '2024-01-15', habitId: 'abc123' });
 * ```
 */
import { useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { getUserTimezone } from '../utils/timezone';

export function useToggleHabitWithTimezone() {
  const rawToggle = useMutation(api.habits.toggleHabit);
  const timezone = useMemo(() => getUserTimezone(), []);

  const toggleHabit = useCallback(
    (args: { date: string; habitId: Id<'habits'> }) =>
      rawToggle({ ...args, timezone }),
    [rawToggle, timezone]
  ) as typeof rawToggle;

  return toggleHabit;
}

export default useToggleHabitWithTimezone;
