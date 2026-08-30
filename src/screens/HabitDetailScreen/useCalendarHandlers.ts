/**
 * useCalendarHandlers — the detail screen's day-toggle handler.
 *
 * Toggling goes through the shared optimistic store, so the calendar, week rail
 * and hero all flip on the tap instead of on the server round-trip; haptics fire
 * immediately and the result is announced to screen readers. `pendingToggleDate`
 * is held for the life of the mutation — it is what disables the day cell and
 * the hero toggle so a second tap cannot race the first.
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { announceToggle } from './announceToggle';
import { triggerHaptic } from '../../utils/haptics';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import { useOptimisticToggleMutation } from '../../lib/optimistic';
import { useIsOnline } from '../../contexts/NetworkStatusContext';
import type { Habit } from './HabitDetailScreen.types';
import { parseDateKeyLocal } from '../../utils/getLocalDateString';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { useSwipeActions } from './useSwipeActions';

interface UseCalendarHandlersProps {
  /** Server + optimistic completion set. Feeds the toggle direction so the
   * optimistic store writes the flipped value, not a stale one. */
  completedDates: Set<string>;
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  /** Date awaiting a mutation response; disables the cell and the hero toggle. */
  setPendingToggleDate: (date: string | null) => void;
}

export const useCalendarHandlers = ({
  completedDates,
  habit,
  onArchive,
  onClose,
  onDelete,
  setPendingArchive,
  setPendingDelete,
  setPendingToggleDate,
}: UseCalendarHandlersProps) => {
  const toggleHabitMutation = useToggleHabitWithTimezone();
  const isOnline = useIsOnline();
  const isCompleted = useCallback(
    (_habitId: Id<'habits'>, date: string) => completedDates.has(date),
    [completedDates]
  );
  const optimisticToggle = useOptimisticToggleMutation(
    toggleHabitMutation,
    isCompleted,
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

  const handleCalendarDayPress = useCallback(
    (date: string, wasCompleted: boolean): void => {
      if (!habit?._id) return;

      const inputDate = parseDateKeyLocal(date);
      const todayDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) return;

      void triggerHaptic(wasCompleted ? 'toggle' : 'success');

      // The optimistic store is written synchronously inside this call, so the
      // UI has already flipped by the time the promise is pending. Failure
      // rolls the store back via optimisticStore.fail.
      setPendingToggleDate(date);
      void optimisticToggle({ date, habitId: habit._id })
        .then(() => {
          announceToggle(habit.name, date, wasCompleted);
        })
        .catch((error: unknown) => {
          if (__DEV__) console.error('Failed to toggle habit:', error);
          Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.TOGGLE_HABIT_FAILED);
        })
        .finally(() => {
          setPendingToggleDate(null);
        });
    },
    [habit?._id, habit?.name, optimisticToggle, setPendingToggleDate]
  );

  return {
    handleCalendarDayPress,
    ...swipeActions,
  };
};
