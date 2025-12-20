import { useCallback } from 'react';
import { View } from 'react-native';
import { addDays, format, parse } from 'date-fns';
import { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist';
import DraggableHabit from '../../../components/DraggableHabit';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../types';

interface UseHabitRenderItemArgs {
  celebrationsEnabled: boolean;
  completionIcon: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void> | void;
  handleHabitPress: (habit: Habit) => void;
  highlightHabitId?: Id<'habits'> | null;
  isReorderingEnabled: boolean;
  notifyWeekCompletion: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showHabitStrengthPercentage: boolean;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown> | void;
  weekDateStrings: string[];
}

export function useHabitRenderItem({
  celebrationsEnabled,
  completionIcon,
  dayShape = 'square',
  getHabitStatus,
  getStreak,
  handleArchive,
  handleHabitPress,
  highlightHabitId,
  isReorderingEnabled,
  notifyWeekCompletion,
  reduceMotionPreference,
  showConnectors = true,
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
              completionIcon={completionIcon}
              dayShape={dayShape}
              habit={item}
              isConnectedToPreviousWeek={isConnectedToPreviousWeek}
              isJustCreated={highlightHabitId === item._id}
              onArchive={handleArchive}
              onLongPress={isReorderingEnabled ? drag : undefined}
              onPress={handleHabitPress}
              onWeekComplete={({ completedDate }) =>
                notifyWeekCompletion({ completedDate, habit: item })
              }
              reduceMotionPreference={reduceMotionPreference}
              showConnectors={showConnectors}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      celebrationsEnabled,
      completionIcon,
      dayShape,
      getHabitStatus,
      getStreak,
      handleArchive,
      handleHabitPress,
      highlightHabitId,
      isReorderingEnabled,
      notifyWeekCompletion,
      reduceMotionPreference,
      showConnectors,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );
}
