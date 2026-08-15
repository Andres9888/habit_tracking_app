/**
 * Wrapper hook around the toggleHabit mutation that automatically injects
 * the user's timezone so server-side streak calculations use local time
 * instead of UTC.
 *
 * Edge case guard: Timezone is re-calculated on every toggle to handle
 * timezone switching (e.g., user travels across timezones).
 *
 * @returns Toggle function that accepts date and habitId
 *
 * @example
 * ```ts
 * const toggleHabit = useToggleHabitWithTimezone();
 * await toggleHabit({ date: '2024-01-15', habitId: 'abc123' });
 * ```
 */
import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { getUserTimezone } from '../utils/timezone';

export function useToggleHabitWithTimezone() {
  const rawToggle = useMutation(api.habits.toggleHabit);

  const toggleHabit = useCallback(
    (args: {
      completed?: boolean;
      date: string;
      habitId: Id<'habits'>;
      kind?: 'full' | 'minimal';
    }) => {
      // Re-read timezone on every toggle to handle timezone switching
      const currentTimezone = getUserTimezone();
      return rawToggle({ ...args, timezone: currentTimezone });
    },
    [rawToggle]
  ) as typeof rawToggle;

  return toggleHabit;
}

export default useToggleHabitWithTimezone;
