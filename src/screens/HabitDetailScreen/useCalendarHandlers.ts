/**
 * useCalendarHandlers
 * Calendar toggle handler for habit detail screen
 *
 * Features:
 * - Haptic feedback on interactions
 * - Accessible error handling
 * - Screen reader announcements for state changes
 * - Timezone-aware habit toggling
 */

import { useCallback, useRef } from 'react';
import { Alert, AccessibilityInfo } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '../../utils/haptics';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import type { Habit } from './HabitDetailScreen.types';
import { parseDateKeyLocal } from '../../utils/getLocalDateString';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { useSwipeActions } from './useSwipeActions';

interface UseCalendarHandlersProps {
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  setPendingToggleDate: (date: string | null) => void;
}

export const useCalendarHandlers = ({
  habit,
  onArchive,
  onClose,
  onDelete,
  setPendingArchive,
  setPendingDelete,
  setPendingToggleDate,
}: UseCalendarHandlersProps) => {
  const toggleHabitMutation = useToggleHabitWithTimezone();
  const togglingRef = useRef(false);

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
      if (togglingRef.current || !habit?._id) return;

      const inputDate = parseDateKeyLocal(date);
      const todayDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) return;

      togglingRef.current = true;
      setPendingToggleDate(date);
      void triggerHaptic(wasCompleted ? 'toggle' : 'success');

      const dateFormatted = parseDateKeyLocal(date).toLocaleDateString(
        'en-US',
        {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }
      );
      const newState = wasCompleted ? 'marked incomplete' : 'marked complete';

      void toggleHabitMutation({ date, habitId: habit._id })
        .then(() => {
          const announcement = `${habit.name} on ${dateFormatted} ${newState}.`;
          if (__DEV__) console.log('A11y announcement:', announcement);
          setTimeout(() => {
            AccessibilityInfo.announceForAccessibility(announcement);
          }, 200);
        })
        .catch((error: unknown) => {
          if (__DEV__) console.error('Failed to toggle habit:', error);
          Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.TOGGLE_HABIT_FAILED);
        })
        .finally(() => {
          togglingRef.current = false;
          setPendingToggleDate(null);
        });
    },
    [habit?._id, habit?.name, toggleHabitMutation, setPendingToggleDate]
  );

  return {
    handleCalendarDayPress,
    ...swipeActions,
  };
};
