/**
 * Library → Habit Detail handoff: close the library native modal first,
 * wait for its unmount, then present detail. One transition at a time.
 */

import { useCallback, useRef } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';

export interface UseLibraryDetailHandoffArgs {
  closeTemplatesScreen: () => void;
  fetchHabit?: (habitId: string) => Promise<Habit | null>;
  habits: Habit[];
  openHabitDetail: (habit: Habit) => void;
}

export function useLibraryDetailHandoff({
  closeTemplatesScreen,
  fetchHabit,
  habits,
  openHabitDetail,
}: UseLibraryDetailHandoffArgs) {
  const convex = useConvex();
  const pendingIdRef = useRef<string | null>(null);
  const openingRef = useRef(false);
  const habitsRef = useRef(habits);
  habitsRef.current = habits;
  const openRef = useRef(openHabitDetail);
  openRef.current = openHabitDetail;
  const fetchRef = useRef(fetchHabit);
  fetchRef.current = fetchHabit;

  const resolveHabit = useCallback(
    async (habitId: string) => {
      const listed = habitsRef.current.find((item) => item._id === habitId);
      if (listed) return listed;
      try {
        if (fetchRef.current) return await fetchRef.current(habitId);
        return await convex.query(api.habits.get, {
          habitId: habitId as Id<'habits'>,
        });
      } catch {
        return null;
      }
    },
    [convex]
  );

  const handleClose = useCallback(() => {
    pendingIdRef.current = null;
    closeTemplatesScreen();
  }, [closeTemplatesScreen]);

  const handleViewHabit = useCallback(
    (habitId: string) => {
      if (openingRef.current || pendingIdRef.current) return;
      pendingIdRef.current = habitId;
      closeTemplatesScreen();
    },
    [closeTemplatesScreen]
  );

  const handleLibraryHidden = useCallback(() => {
    const habitId = pendingIdRef.current;
    pendingIdRef.current = null;
    if (!habitId || openingRef.current) return;
    void (async () => {
      const habit = await resolveHabit(habitId);
      if (!habit || openingRef.current) return;
      openingRef.current = true;
      openRef.current(habit);
      openingRef.current = false;
    })();
  }, [resolveHabit]);

  return { handleClose, handleLibraryHidden, handleViewHabit };
}
