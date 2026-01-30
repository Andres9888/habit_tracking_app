/**
 * HeroSection Component
 * Icon, Name, Description, and Streak Badge
 */

import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
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
  // Initialize unconditionally to follow rules of hooks
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);

  // Streak badge animation on load (T1.2)
  // Initialize unconditionally - animation state set in useEffect
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);

  // Track timeout for cleanup
  const badgeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showStreakBadge = currentStreak >= 7;

  useEffect(() => {
    // Clear any pending timeout from previous render
    if (badgeTimeoutRef.current) {
      clearTimeout(badgeTimeoutRef.current);
      badgeTimeoutRef.current = null;
    }

    if (reduceMotion) {
      // Immediately set final values without animation
      iconScale.value = 1;
      iconTranslateY.value = 0;
      badgeScale.value = showStreakBadge ? 1 : 0;
      badgeOpacity.value = showStreakBadge ? 1 : 0;
      return;
    }

    // Set initial values for entrance animation
    iconScale.value = 0.8;
    iconTranslateY.value = -10;
    badgeScale.value = 0;
    badgeOpacity.value = 0;

    // Animate icon entrance
    iconScale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 150 });
    iconTranslateY.value = withSpring(0, {
      damping: 8,
      mass: 1,
      stiffness: 150,
    });

    // Animate badge entrance with delay
    if (showStreakBadge) {
      badgeTimeoutRef.current = setTimeout(() => {
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

    // Cleanup: cancel animations and clear timeout on unmount
    return () => {
      if (badgeTimeoutRef.current) {
        clearTimeout(badgeTimeoutRef.current);
        badgeTimeoutRef.current = null;
      }
      // Cancel any running animations to prevent writes to unmounted component
      cancelAnimation(iconScale);
      cancelAnimation(iconTranslateY);
      cancelAnimation(badgeScale);
      cancelAnimation(badgeOpacity);
    };
  }, [
    showStreakBadge,
    reduceMotion,
    iconScale,
    iconTranslateY,
    badgeScale,
    badgeOpacity,
  ]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: iconScale.value ?? 1 },
        { translateY: iconTranslateY.value ?? 0 },
      ],
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: badgeOpacity.value ?? 0,
      transform: [{ scale: badgeScale.value ?? 0 }],
    };
  });

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
