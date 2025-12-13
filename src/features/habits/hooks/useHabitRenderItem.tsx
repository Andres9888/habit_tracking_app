import { useCallback } from 'react';
import { View } from 'react-native';
import { addDays, format, parse } from 'date-fns';
import { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../types';

interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  habitCompletionIcon: 'chain' | 'checkbox';
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleHabitPress: (habit: Habit) => void;
  handleMorePress?: (habit: Habit) => void;
  isReorderingEnabled: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  highlightHabitId?: Id<'habits'> | null;
  reduceMotionPreference: boolean;
  showHabitStrengthPercentage: boolean;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown> | void;
  weekDateStrings: string[];
}

export function useHabitRenderItem({
  celebrationsEnabled,
  getHabitStatus,
  getStreak,
  habitCompletionIcon,
  handleArchive,
  handleHabitPress,
  handleMorePress,
  isReorderingEnabled,
  notifyWeekCompletion,
  highlightHabitId,
  reduceMotionPreference,
  showHabitStrengthPercentage,
  toggleHabit,
  weekDateStrings,
}: UseHabitRenderItemArgs) {
  return useCallback(
    ({ item, drag, isActive }: RenderItemParams<Habit>) => {
      const weekStatus = weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);

      // Check if previous day was completed to show connecting chain
      const firstDateString = weekDateStrings[0];
      let isConnectedToPreviousWeek = false;

      if (firstDateString) {
        try {
          const firstDate = parse(firstDateString, 'yyyy-MM-dd', new Date());
          const previousDate = addDays(firstDate, -1);
          const previousDateString = format(previousDate, 'yyyy-MM-dd');
          isConnectedToPreviousWeek = getHabitStatus(item._id, previousDateString) === 'done';
        } catch (e) {
          console.warn('Error calculating previous date status', e);
        }
      }

      return (
        <ScaleDecorator>
          <View
            className='mb-5'
            style={{
              opacity: isActive ? 0.7 : 1,
            }}
          >
            <DraggableHabit
              celebrationsEnabled={celebrationsEnabled}
              habitCompletionIcon={habitCompletionIcon}
              habit={item}
              isConnectedToPreviousWeek={isConnectedToPreviousWeek}
              isJustCreated={highlightHabitId === item._id}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
              onArchive={handleArchive}
              onLongPress={isReorderingEnabled ? drag : undefined}
              onMorePress={handleMorePress}
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
      habitCompletionIcon,
      handleArchive,
      handleHabitPress,
      handleMorePress,
      isReorderingEnabled,
      reduceMotionPreference,
      notifyWeekCompletion,
      highlightHabitId,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );
}
