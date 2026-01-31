/**
 * useCalendarHandlers
 * Calendar toggle and undo/redo handlers for habit detail screen
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import * as Haptics from 'expo-haptics';
import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit } from './HabitDetailScreen.types';

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
  const toggleHabitMutation = useMutation(api.habits.toggleHabit);

  const handleCalendarDayPress = useCallback(
    (date: string, wasCompleted: boolean): void => {
      if (isTogglingCalendar || !habit?._id) return;

      const inputDate = new Date(date);
      const todayDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate > todayDate) return;

      setIsTogglingCalendar(true);
      toggleHabitMutation({ date, habitId: habit._id })
        .catch((error: unknown) => {
          if (__DEV__) {
            console.error('Failed to toggle habit:', error);
          }
          Alert.alert('Error', 'Failed to update habit. Please try again.');
        })
        .finally(() => setIsTogglingCalendar(false));
    },
    [isTogglingCalendar, habit?._id, toggleHabitMutation, setIsTogglingCalendar]
  );

  const handleSwipeDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setPendingDelete(true);
  }, [setPendingDelete]);

  const handleSwipeArchive = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setPendingArchive(true);
  }, [setPendingArchive]);

  const handleConfirmDelete = useCallback(() => {
    setPendingDelete(false);
    if (habit) {
      onDelete?.(habit._id);
      onClose();
    }
  }, [habit, onDelete, onClose, setPendingDelete]);

  const handleConfirmArchive = useCallback(() => {
    setPendingArchive(false);
    if (habit) {
      onArchive?.(habit._id);
      onClose();
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
