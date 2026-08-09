/**
 * useCalendarHandlers — calendar toggle + swipe actions for habit detail.
 * Routes completions through the optimistic/offline-queue path.
 */
import { useCallback, useRef } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import { useIsOnline } from '../../contexts/NetworkStatusContext/hooks';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import { useOptimisticToggleMutation } from '../../lib/optimistic';
import { getLocalDateString } from '../../utils/getLocalDateString';
import type { Habit } from './HabitDetailScreen.types';
import { runHabitDayToggle } from './runHabitDayToggle';
import { useSwipeActions } from './useSwipeActions';

interface UseCalendarHandlersProps {
  habit: Habit | null;
  completedDates: Set<string>;
  isCompletedToday: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  setPendingToggleDate: (date: string | null) => void;
  setPendingMinimal: (pending: boolean) => void;
}

export const useCalendarHandlers = ({
  habit,
  completedDates,
  isCompletedToday,
  onArchive,
  onClose,
  onDelete,
  setPendingArchive,
  setPendingDelete,
  setPendingToggleDate,
  setPendingMinimal,
}: UseCalendarHandlersProps) => {
  const isOnline = useIsOnline();
  const toggleHabitMutation = useToggleHabitWithTimezone();
  const togglingRef = useRef(false);
  const completedRef = useRef(isCompletedToday);
  completedRef.current = isCompletedToday;
  const datesRef = useRef(completedDates);
  datesRef.current = completedDates;

  const optimisticToggle = useOptimisticToggleMutation(
    toggleHabitMutation,
    (_habitId, date) => {
      if (date === getLocalDateString()) return completedRef.current;
      return datesRef.current.has(date);
    },
    { isOnline }
  );

  const swipeActions = useSwipeActions({
    habit,
    onArchive,
    onClose,
    onDelete,
    setPendingArchive,
    setPendingDelete,
  });

  const runToggle = useCallback(
    (date: string, wasCompleted: boolean, kind?: 'full' | 'minimal') => {
      if (togglingRef.current || !habit?._id) return;
      togglingRef.current = true;
      void runHabitDayToggle({
        date,
        habitId: habit._id,
        habitName: habit.name,
        kind,
        setPendingMinimal,
        setPendingToggleDate,
        toggle: optimisticToggle,
        wasCompleted,
      }).finally(() => {
        togglingRef.current = false;
      });
    },
    [
      habit?._id,
      habit?.name,
      optimisticToggle,
      setPendingMinimal,
      setPendingToggleDate,
    ]
  );

  const handleCalendarDayPress = useCallback(
    (date: string, wasCompleted: boolean): void => {
      runToggle(date, wasCompleted);
    },
    [runToggle]
  );

  const handleMinimalCompleteToday = useCallback((): void => {
    if (isCompletedToday) return;
    runToggle(getLocalDateString(), false, 'minimal');
  }, [isCompletedToday, runToggle]);

  return {
    handleCalendarDayPress,
    handleMinimalCompleteToday,
    ...swipeActions,
  };
};
