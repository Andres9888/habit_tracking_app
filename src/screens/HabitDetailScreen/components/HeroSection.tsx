/**
 * HeroSection Component
 * Icon, Name, Description, and Streak Badge
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { HeroSectionProps } from '../HabitDetailScreen.types';
import { useHeroAnimations } from './useHeroAnimations';

const getStreakBadgeText = (streak: number): string => {
  if (streak >= 30) return `\u{1F31F} ${streak} day streak!`;
  if (streak >= 14) return `\u{1F525} ${streak} day streak!`;
  return `\u{26A1} ${streak} day streak!`;
};

export function HeroSection({
  currentStreak,
  habit,
  isCompletedToday,
  reduceMotion = false,
}: HeroSectionProps) {
  const showStreakBadge = currentStreak >= 7;
  const { iconAnimatedStyle, badgeAnimatedStyle } = useHeroAnimations(
    showStreakBadge,
    reduceMotion
  );

  return (
    <View className='items-center pb-4'>
      {habit.icon && (
        <Animated.View
          className='mb-3 h-20 w-20 items-center justify-center rounded-2xl shadow-lg'
          style={[
            { backgroundColor: habit.iconColor || '#fef3c7' },
            iconAnimatedStyle,
          ]}
        >
          <Text className='text-4xl'>{habit.icon}</Text>
        </Animated.View>
      )}

      <Text className='text-xl font-bold text-stone-900'>{habit.name}</Text>

      {showStreakBadge && (
        <Animated.View
          accessibilityLabel={`${currentStreak} day streak`}
          className='mt-2 rounded-full px-3 py-1'
          style={badgeAnimatedStyle}
        >
          <LinearGradient
            colors={['#ffedd5', '#fef3c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className='absolute inset-0 rounded-full'
          />
          <Text className='text-xs font-semibold text-orange-600'>
            {getStreakBadgeText(currentStreak)}
          </Text>
        </Animated.View>
      )}

      {habit.notes ? (
        <Text className='mt-1 px-6 text-center text-sm text-stone-500'>
          {habit.notes}
        </Text>
      ) : null}
    </View>
  );
}
