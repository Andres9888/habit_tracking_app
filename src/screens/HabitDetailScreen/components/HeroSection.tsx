/**
 * HeroSection Component
 * Icon, Name, Description, and Streak Badge
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../theme';
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
  reduceMotion = false,
}: HeroSectionProps) {
  const { colors, isDark } = useThemeColors();
  const showStreakBadge = currentStreak >= 7;
  const { iconAnimatedStyle, badgeAnimatedStyle } = useHeroAnimations(
    showStreakBadge,
    reduceMotion
  );

  const badgeGradient = isDark
    ? ['#422006', '#451a03'] as const
    : ['#ffedd5', '#fef3c7'] as const;

  return (
    <View className='items-center pb-4'>
      {habit.icon ? <Animated.View
          className='mb-3 h-20 w-20 items-center justify-center rounded-2xl shadow-lg'
          style={[
            { backgroundColor: (habit.color ?? habit.iconColor) || '#fef3c7' },
            iconAnimatedStyle,
          ]}
        >
          <Text className='text-4xl'>{habit.icon}</Text>
        </Animated.View> : null}

      <Text
        className='text-xl font-bold'
        style={{ color: colors.text.primary }}
      >
        {habit.name}
      </Text>

      {showStreakBadge ? <Animated.View
          accessibilityLabel={`${currentStreak} day streak`}
          className='mt-2 rounded-full px-3 py-1'
          style={badgeAnimatedStyle}
        >
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={badgeGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Text
            className='text-xs font-semibold'
            style={{ color: isDark ? '#FDBA74' : '#EA580C' }}
          >
            {getStreakBadgeText(currentStreak)}
          </Text>
        </Animated.View> : null}

      {habit.notes ? (
        <Text
          className='mt-1 px-6 text-center text-sm'
          style={{ color: colors.text.secondary }}
        >
          {habit.notes}
        </Text>
      ) : null}
    </View>
  );
}
