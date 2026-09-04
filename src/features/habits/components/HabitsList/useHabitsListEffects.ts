/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect, type MutableRefObject } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import {
  ENTRANCE_ANIMATION_DELAY_MS,
  NEW_HABIT_HIGHLIGHT_MS,
} from '@/constants';

/**
 * Inputs required to manage HabitsList lifecycle side effects.
 */
interface UseHabitsListEffectsOptions {
  holdJustCreatedHighlight: boolean;
  justCreatedHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
  shouldTriggerHabitEntrance: boolean;
  setShouldTriggerHabitEntrance: (value: boolean) => void;
  habits: readonly Pick<Habit, '_id'>[];
  initialEntranceDoneRef: MutableRefObject<boolean>;
  seenHabitIdsRef: MutableRefObject<Set<string>>;
}

/**
 * Runs non-visual HabitsList effects:
 * - clears transient "just created" highlight state
 * - triggers initial row entrance animation once layout settles
 */
export function useHabitsListEffects(options: UseHabitsListEffectsOptions) {
  const {
    holdJustCreatedHighlight,
    justCreatedHabitId,
    setJustCreatedHabitId,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
    habits,
    initialEntranceDoneRef,
    seenHabitIdsRef,
  } = options;
  const habitsLength = habits.length;

  // Clear "just created" highlight after a delay
  useEffect(() => {
    if (!justCreatedHabitId || holdJustCreatedHighlight) return;
    const timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [holdJustCreatedHighlight, justCreatedHabitId, setJustCreatedHabitId]);

  // Trigger entrance animation after layout settles
  useEffect(() => {
    if (shouldTriggerHabitEntrance || habitsLength === 0) return;
    const timer = setTimeout(() => setShouldTriggerHabitEntrance(true), ENTRANCE_ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [
    habitsLength,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
  ]);

  // After the first commit with rows, later virtualization mounts skip entering.
  // Every habit present at that commit also counts as seen: a row FlatList
  // mounts later while scrolling must paint on its first frame, not start at
  // opacity 0 and play the card entrance (that was the blank cards during a
  // fast fling). Habits added afterwards stay unseen and keep their entrance.
  useEffect(() => {
    if (habitsLength === 0 || initialEntranceDoneRef.current) return;
    for (const habit of habits) seenHabitIdsRef.current.add(habit._id);
    initialEntranceDoneRef.current = true;
  }, [habits, habitsLength, initialEntranceDoneRef, seenHabitIdsRef]);
}
