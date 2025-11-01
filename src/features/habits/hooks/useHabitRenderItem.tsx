import { useCallback } from 'react';
import { View } from 'react-native';
import { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../types';

interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  weekDateStrings: string[];
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  showHabitStrengthPercentage: boolean;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown> | void;
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleHabitPress: (habit: Habit) => void;
  reduceMotionPreference: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
}

export function useHabitRenderItem({
  celebrationsEnabled,
  weekDateStrings,
  getHabitStatus,
  getStreak,
  showHabitStrengthPercentage,
  toggleHabit,
  handleArchive,
  handleHabitPress,
  reduceMotionPreference,
  notifyWeekCompletion,
}: UseHabitRenderItemArgs) {
  return useCallback(
    ({ item, drag, isActive }: RenderItemParams<Habit>) => {
      const weekStatus = weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);

      return (
        <ScaleDecorator>
          <View className='mb-3' style={{ opacity: isActive ? 0.7 : 1 }}>
            <DraggableHabit
              celebrationsEnabled={celebrationsEnabled}
              habit={item}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
              onArchive={handleArchive}
              onLongPress={drag}
              onPress={handleHabitPress}
              onWeekComplete={({ completedDate }) =>
                notifyWeekCompletion({ completedDate, habit: item })
              }
              reduceMotionPreference={reduceMotionPreference}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      celebrationsEnabled,
      getHabitStatus,
      getStreak,
      handleArchive,
      handleHabitPress,
      reduceMotionPreference,
      notifyWeekCompletion,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );
}
