/**
 * "Show this habit on Home" request raised by the post-create toast.
 *
 * Unlike the Habit Library's focus request, Home is already on screen: the
 * list scrolls to the row in view instead of remounting hidden behind a
 * modal. The request expires on its own so a habit that never reaches
 * habits.list cannot leave a stale one behind.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export const REVEAL_GIVE_UP_MS = 4000;

export interface RevealHabitState {
  revealHabitId: Id<'habits'> | null;
  revealHabitOnHome: (habitId: Id<'habits'>) => void;
  clearRevealHabit: () => void;
}

export function useRevealHabitOnHome(): RevealHabitState {
  const [revealHabitId, setRevealHabitId] = useState<Id<'habits'> | null>(
    null
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRevealHabit = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setRevealHabitId(null);
  }, []);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const revealHabitOnHome = useCallback(
    (habitId: Id<'habits'>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRevealHabitId(habitId);
      timerRef.current = setTimeout(clearRevealHabit, REVEAL_GIVE_UP_MS);
    },
    [clearRevealHabit]
  );

  return { clearRevealHabit, revealHabitId, revealHabitOnHome };
}
