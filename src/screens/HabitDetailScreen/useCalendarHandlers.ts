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
import { useOptimisticToggleMutation } from '../../lib/optimistic';
import { useIsOnline } from '../../contexts/NetworkStatusContext';
import type { Habit } from './HabitDetailScreen.types';
import {
  parseDateKeyLocal,
  getLocalDateString,
} from '../../utils/getLocalDateString';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { useSwipeActions } from './useSwipeActions';

interface UseCalendarHandlersProps {
  completedDates: Set<string>;
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
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
  const optimisticToggle = useOptimisticToggleMutation(
    toggleHabitMutation,
    (_habitId, date) => completedDates.has(date),
    { isOnline }
  );
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
      if (date > getLocalDateString()) return;

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

      void optimisticToggle({
        completed: !wasCompleted,
        date,
        habitId: habit._id,
      })
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
    [
      completedDates,
      habit?._id,
      habit?.name,
      optimisticToggle,
      setPendingToggleDate,
    ]
  );

  return {
    handleCalendarDayPress,
    ...swipeActions,
  };
};
