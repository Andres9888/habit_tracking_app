import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { useOptimisticToggle } from '../../lib/optimistic/hooks/useOptimisticState';
import { applyOptimisticToday } from './optimisticToday';
import { useDetailCompletedDates } from './useDetailCompletedDates';
import { useLoggedStreak } from './useLoggedStreak';

interface UseHabitDetailScreenStateProps {
  bestStreak: number;
  currentStreak: number;
  habitId: Id<'habits'> | undefined;
  pausedAt?: number;
  resumedAt?: number;
  tracking: HabitTrackingEntry[];
  visible?: boolean;
}

export const useHabitDetailScreenState = ({
  bestStreak,
  currentStreak,
  habitId,
  pausedAt,
  resumedAt,
  tracking,
  visible: _visible,
}: UseHabitDetailScreenStateProps) => {
  // Delete/Archive undo toast states (T3.5: Swipe-to-delete)
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);

  // Calendar toggling state — date of the cell awaiting mutation response
  const [pendingToggleDate, setPendingToggleDate] = useState<string | null>(
    null
  );

  // Today's date
  const today = useMemo(() => getLocalDateString(), []);

  const completedDates = useDetailCompletedDates(habitId, tracking);

  // Overlay any pending optimistic toggle for today so the hero (Done button,
  // streak, total) reacts instantly like the calendar, then self-reconciles.
  const optimisticToggle = useOptimisticToggle(
    (habitId ?? '') as Id<'habits'>,
    today
  );
  const optimistic = applyOptimisticToday(
    {
      bestStreak,
      completedToday: completedDates.has(today),
      currentStreak,
      totalCompletions: completedDates.size,
    },
    optimisticToggle
  );

  // What the toast is allowed to say. `optimistic.currentStreak` is the habit
  // doc's stored value ±1, which is a lie the moment a miss went unrecorded.
  const loggedStreak = useLoggedStreak(completedDates, {
    isCompletedToday: optimistic.isCompletedToday,
    pausedAt,
    resumedAt,
    today,
  });

  return {
    bestStreak: optimistic.bestStreak,
    completedDates,
    currentStreak: optimistic.currentStreak,
    isCompletedToday: optimistic.isCompletedToday,
    loggedStreak,
    pendingArchive,
    pendingDelete,
    pendingToggleDate,
    setPendingToggleDate,
    setPendingArchive,
    setPendingDelete,
    totalCompletions: optimistic.totalCompletions,
  };
};
