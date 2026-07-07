/**
 * useCalendarHandlers
 * Calendar toggle handler for habit detail screen
 *
 * Day taps go through the shared optimistic store
 * (useOptimisticToggleMutation): the cell paints instantly, rapid multi-day
 * backfill runs unserialized, and network failures queue for offline sync.
 * Non-network errors roll the optimistic state back and surface an alert.
 */

import { useCallback } from 'react';
import { Alert, AccessibilityInfo } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { useIsOnline } from '../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import { useOptimisticToggleMutation } from '../../lib/optimistic';
import { triggerHaptic } from '../../utils/haptics';
import type { Habit } from './HabitDetailScreen.types';
import { useSwipeActions } from './useSwipeActions';

interface UseCalendarHandlersProps {
  habit: Habit | null;
  isCompletedOn: (date: string) => boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
}

export const useCalendarHandlers = ({
  habit,
  isCompletedOn,
  onArchive,
  onClose,
  onDelete,
  setPendingArchive,
  setPendingDelete,
}: UseCalendarHandlersProps) => {
  const serverToggle = useToggleHabitWithTimezone();
  const isOnline = useIsOnline();

  const wrappedToggle = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await serverToggle(args);
    },
    [serverToggle]
  );
  // Reads the MERGED completed set so a double-tap on the same day sees the
  // in-flight optimistic value and reverses it.
  const getCurrentStatus = useCallback(
    (_habitId: Id<'habits'>, date: string) => isCompletedOn(date),
    [isCompletedOn]
  );
  const toggleOptimistic = useOptimisticToggleMutation(
    wrappedToggle,
    getCurrentStatus,
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

      const inputDate = new Date(date);
      const todayDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) return;

      void triggerHaptic(wasCompleted ? 'toggle' : 'success');

      const dateFormatted = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      const newState = wasCompleted ? 'marked incomplete' : 'marked complete';
      const announcement = `${habit.name} on ${dateFormatted} ${newState}.`;

      void toggleOptimistic({ date, habitId: habit._id })
        .then(() => {
          if (__DEV__) console.log('A11y announcement:', announcement);
          setTimeout(() => {
            AccessibilityInfo.announceForAccessibility(announcement);
          }, 200);
        })
        .catch((error: unknown) => {
          if (__DEV__) console.error('Failed to toggle habit:', error);
          Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.TOGGLE_HABIT_FAILED);
        });
    },
    [habit?._id, habit?.name, toggleOptimistic]
  );

  return {
    handleCalendarDayPress,
    ...swipeActions,
  };
};
