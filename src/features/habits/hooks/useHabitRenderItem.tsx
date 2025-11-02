import { useCallback, useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
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
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      const weekStatus = weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);
      const index = getIndex?.() ?? 0;

      // Stagger animation values
      const StaggeredCard = ({ children }: { children: React.ReactNode }) => {
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const slideAnim = useRef(new Animated.Value(20)).current;

        useEffect(() => {
          // Stagger delay: 50ms per item for premium cascade
          const delay = index * 50;

          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }, []);

        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {children}
          </Animated.View>
        );
      };

      return (
        <ScaleDecorator>
          <StaggeredCard>
            <View
              className='mb-4'
              style={{
                opacity: isActive ? 0.7 : 1,
              }}
            >
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
          </StaggeredCard>
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
