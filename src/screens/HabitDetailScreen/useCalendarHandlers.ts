/**
 * useCalendarHandlers
 * Calendar toggle and undo/redo handlers for habit detail screen
 *
 * Features:
 * - Haptic feedback on interactions
 * - Accessible error handling
 * - Screen reader announcements for state changes
 * - Timezone-aware habit toggling
 * - Undo support for delete and archive actions
 */

import { useCallback } from 'react';
import { Alert, AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { Id } from '../../../convex/_generated/dataModel';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import type { Habit } from './HabitDetailScreen.types';
import { ERROR_MESSAGES } from '../../constants/errorMessages';

interface UseCalendarHandlersProps {
  habit: Habit | null;
  isTogglingCalendar: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  setIsTogglingCalendar: (toggling: boolean) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
}

export const useCalendarHandlers = ({
  habit,
  isTogglingCalendar,
  onArchive,
  onClose,
  onDelete,
  setIsTogglingCalendar,
  setPendingArchive,
  setPendingDelete,
}: UseCalendarHandlersProps) => {
  const toggleHabitMutation = useToggleHabitWithTimezone();

  const handleCalendarDayPress = useCallback(
    (date: string, wasCompleted: boolean): void => {
      if (isTogglingCalendar || !habit?._id) return;

      const inputDate = new Date(date);
      const todayDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) return;

      setIsTogglingCalendar(true);
      Haptics.impactAsync(
        wasCompleted
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );

      const dateFormatted = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      const newState = wasCompleted ? 'marked incomplete' : 'marked complete';

      toggleHabitMutation({ date, habitId: habit._id })
        .then(() => {
          // Announce state change to screen readers
          const announcement = `${habit.name} on ${dateFormatted} ${newState}.`;
          if (__DEV__) console.log('A11y announcement:', announcement);
          // Use setTimeout to ensure the DOM has updated
          setTimeout(() => {
            AccessibilityInfo.announceForAccessibility(announcement);
          }, 200);
        })
        .catch((error: unknown) => {
          if (__DEV__) console.error('Failed to toggle habit:', error);
          Alert.alert('Error', ERROR_MESSAGES.DATA_OPS.TOGGLE_HABIT_FAILED);
        })
        .finally(() => setIsTogglingCalendar(false));
    },
    [isTogglingCalendar, habit?._id, habit?.name, toggleHabitMutation, setIsTogglingCalendar]
  );

  const handleSwipeDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPendingDelete(true);
    // Announce pending deletion for screen readers
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(
        `${habit?.name} marked for deletion. Undo available.`
      );
    }, 100);
  }, [setPendingDelete, habit?.name]);

  const handleSwipeArchive = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPendingArchive(true);
    // Announce pending archive for screen readers
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(
        `${habit?.name} marked for archiving. Undo available.`
      );
    }, 100);
  }, [setPendingArchive, habit?.name]);

  const handleConfirmDelete = useCallback(() => {
    setPendingDelete(false);
    if (habit) {
      onDelete?.(habit._id);
      onClose();
      // Announce deletion completion
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `${habit.name} has been deleted.`
        );
      }, 100);
    }
  }, [habit, onDelete, onClose, setPendingDelete]);

  const handleConfirmArchive = useCallback(() => {
    setPendingArchive(false);
    if (habit) {
      onArchive?.(habit._id);
      onClose();
      // Announce archive completion
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          `${habit.name} has been archived.`
        );
      }, 100);
    }
  }, [habit, onArchive, onClose, setPendingArchive]);

  const handleUndoDelete = useCallback(
    () => setPendingDelete(false),
    [setPendingDelete]
  );
  const handleUndoArchive = useCallback(
    () => setPendingArchive(false),
    [setPendingArchive]
  );

  return {
    handleCalendarDayPress,
    handleConfirmArchive,
    handleConfirmDelete,
    handleSwipeArchive,
    handleSwipeDelete,
    handleUndoArchive,
    handleUndoDelete,
  };
};
