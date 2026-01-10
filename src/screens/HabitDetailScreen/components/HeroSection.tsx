/**
 * HeroSection Component
 * Icon, Name, Description, and Streak Badge
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { HeroSectionProps } from '../HabitDetailScreen.types';

// Get streak badge text based on streak length (T1.2)
const getStreakBadgeText = (streak: number): string => {
  if (streak >= 30) return `🌟 ${streak} day streak!`;
  if (streak >= 14) return `🔥 ${streak} day streak!`;
  return `⚡ ${streak} day streak!`;
};

export function HeroSection({
  currentStreak,
  habit,
  isCompletedToday,
  reduceMotion = false,
}: HeroSectionProps) {
  // Icon bounce animation on load (T1.1)
  const iconScale = useSharedValue(reduceMotion ? 1 : 0.8);
  const iconTranslateY = useSharedValue(reduceMotion ? 0 : -10);

  // Streak badge animation on load (T1.2)
  const showStreakBadge = currentStreak >= 7;
  const badgeScale = useSharedValue(reduceMotion && showStreakBadge ? 1 : 0);
  const badgeOpacity = useSharedValue(reduceMotion && showStreakBadge ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      iconScale.value = 1;
      iconTranslateY.value = 0;
      if (showStreakBadge) {
        badgeScale.value = 1;
        badgeOpacity.value = 1;
      }
      return;
    }

    iconScale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 150 });
    iconTranslateY.value = withSpring(0, {
      damping: 8,
      mass: 1,
      stiffness: 150,
    });

    if (showStreakBadge) {
      setTimeout(() => {
        badgeOpacity.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        badgeScale.value = withSpring(1, {
          damping: 10,
          mass: 1,
          stiffness: 200,
        });
      }, 400);
    }
  }, [showStreakBadge, reduceMotion]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

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
          className='mt-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1'
          style={badgeAnimatedStyle}
        >
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
