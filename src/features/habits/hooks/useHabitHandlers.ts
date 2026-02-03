import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';

interface UseHabitHandlersArgs {
  reorderHabits: (args: { habitIds: Id<'habits'>[] }) => Promise<unknown> | void;
  archiveHabit: (args: { habitId: Id<'habits'> }) => Promise<unknown> | void;
  removeHabit: (args: { habitId: Id<'habits'> }) => Promise<unknown> | void;
  setSelectedHabit: (habit: Habit | null) => void;
  setIsHabitCalendarOpen: (value: boolean) => void;
  setIsHabitDetailOpen: (value: boolean) => void;
}

export function useHabitHandlers({
  reorderHabits,
  archiveHabit,
  removeHabit,
  setSelectedHabit,
  setIsHabitCalendarOpen,
  setIsHabitDetailOpen,
}: UseHabitHandlersArgs) {
  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      const habitIds = data.map((habit) => habit._id as Id<'habits'>);
      try {
        await reorderHabits({ habitIds });
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to reorder habits:', error);
        }
        // Error is handled silently - order reverts on failure
      }
    },
    [reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const handleDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      const finalizeDeletion = async () => {
        await removeHabit({ habitId });
        setIsHabitDetailOpen(false);
        setSelectedHabit(null);
      };

      if (Platform.OS === 'web') {
        if (
          !confirm(
            'Are you sure you want to delete this habit? This cannot be undone.'
          )
        ) {
          return;
        }
        await finalizeDeletion();
        return;
      }

      Alert.alert(
        'Delete Habit',
        'Are you sure you want to delete this habit? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: finalizeDeletion,
          },
        ]
      );
    },
    [removeHabit, setIsHabitDetailOpen, setSelectedHabit]
  );

  const handleHabitPress = useCallback(
    (habit: Habit) => {
      setSelectedHabit(habit);
      setIsHabitCalendarOpen(true);
    },
    [setIsHabitCalendarOpen, setSelectedHabit]
  );

  const handleHabitLongPress = useCallback(
    (habit: Habit) => {
      setSelectedHabit(habit);
      setIsHabitCalendarOpen(true);
    },
    [setIsHabitCalendarOpen, setSelectedHabit]
  );

  return {
    handleDragEnd,
    handleArchive,
    handleDeleteHabit,
    handleHabitPress,
    handleHabitLongPress,
  };
}
