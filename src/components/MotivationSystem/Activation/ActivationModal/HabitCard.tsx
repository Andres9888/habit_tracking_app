import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { Flame, Target } from 'lucide-react-native';
import type { ActivationHabitData } from './types';
import { SPRING_BOUNCY, SPRING_BUTTON } from './constants';

interface HabitCardProps {
  habit: ActivationHabitData;
  reduceMotion?: boolean;
}

/**
 * HabitCard - Displays habit info with streak at top of modal
 */
export function HabitCard({ habit, reduceMotion }: HabitCardProps) {
  const streakScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion || !habit.currentStreak) return;

    // Subtle pulse on streak number
    streakScale.value = withDelay(
      400,
      withSequence(withSpring(1.1, SPRING_BOUNCY), withSpring(1, SPRING_BUTTON))
    );
  }, [reduceMotion, habit.currentStreak, streakScale]);

  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  return (
    <View className='flex-row items-center rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50'>
      {/* Habit Icon */}
      <View className='mr-4 h-14 w-14 items-center justify-center rounded-xl bg-amber-100'>
        <Text className='text-2xl'>{habit.icon || '✨'}</Text>
      </View>

      {/* Habit Info */}
      <View className='flex-1'>
        <Text className='text-lg font-semibold text-stone-800'>
          {habit.name}
        </Text>
        <View className='mt-1 flex-row items-center gap-3'>
          {/* Streak */}
          {habit.currentStreak !== undefined && habit.currentStreak > 0 ? <Animated.View
              className='flex-row items-center gap-1'
              style={streakAnimatedStyle}
            >
              <Flame className='text-orange-500' size={14} />
              <Text className='text-sm font-medium text-stone-600'>
                {habit.currentStreak} day streak
              </Text>
            </Animated.View> : null}
          {/* Completions */}
          {habit.totalCompletions !== undefined &&
            habit.totalCompletions > 0 ? <View className='flex-row items-center gap-1'>
                <Target className='text-emerald-500' size={14} />
                <Text className='text-sm text-stone-500'>
                  {habit.totalCompletions} total
                </Text>
              </View> : null}
        </View>
      </View>
    </View>
  );
}
