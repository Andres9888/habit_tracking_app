import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { Flame, Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
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
  const { colors: themeColors } = useThemeColors();
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
    <View className='flex-row items-center rounded-2xl p-4 shadow-sm' style={{ backgroundColor: themeColors.card, shadowColor: themeColors.border }}>
      {/* Habit Icon */}
      <View className='mr-4 h-14 w-14 items-center justify-center rounded-xl' style={{ backgroundColor: themeColors.status.warningLight }}>
        <Text className='text-2xl'>{habit.icon || '✨'}</Text>
      </View>

      {/* Habit Info */}
      <View className='flex-1'>
        <Text className='text-lg font-semibold' style={{ color: themeColors.text.primary }}>
          {habit.name}
        </Text>
        <View className='mt-1 flex-row items-center gap-3'>
          {/* Streak */}
          {habit.currentStreak !== undefined && habit.currentStreak > 0 ? <Animated.View
              className='flex-row items-center gap-1'
              style={streakAnimatedStyle}
            >
              <Flame color={themeColors.status.streak} size={iconSizes.small} />
              <Text className='text-sm font-medium' style={{ color: themeColors.text.primary }}>
                {habit.currentStreak} day streak
              </Text>
            </Animated.View> : null}
          {/* Completions */}
          {habit.totalCompletions !== undefined &&
            habit.totalCompletions > 0 ? <View className='flex-row items-center gap-1'>
                <Target color={themeColors.status.success} size={iconSizes.small} />
                <Text className='text-sm' style={{ color: themeColors.text.secondary }}>
                  {habit.totalCompletions} total
                </Text>
              </View> : null}
        </View>
      </View>
    </View>
  );
}
