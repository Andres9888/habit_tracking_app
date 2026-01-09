/**
 * CelebrationHeader - Animated celebration header with icon and message
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PartyPopper, Crown } from 'lucide-react-native';

import { SPRING_BOUNCY } from '../constants';
import { ConfettiBurst } from './animations';
import type { CelebrationHeaderProps } from '../types';

export function CelebrationHeader({
  habitName,
  isStreakMilestone,
  milestoneNumber,
  reduceMotion,
}: CelebrationHeaderProps) {
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      iconScale.value = 1;
      return;
    }

    // Pop-in animation: 0 → 1.2 → 1 with slight rotation
    iconScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(100, withSpring(1.2, SPRING_BOUNCY)),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Subtle wiggle
    iconRotate.value = withDelay(
      400,
      withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 80 }),
        withTiming(3, { duration: 80 }),
        withTiming(0, { duration: 60 })
      )
    );
  }, [reduceMotion, iconScale, iconRotate]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error
      { rotate: `${Math.round(iconRotate.value)}deg` },
    ],
  }));

  return (
    <View className='items-center rounded-2xl bg-emerald-50 p-6'>
      {/* Confetti effect */}
      <ConfettiBurst reduceMotion={reduceMotion} />

      {/* Celebration icon */}
      <Animated.View
        className='mb-4 h-20 w-20 items-center justify-center rounded-full bg-emerald-100'
        style={iconAnimatedStyle}
      >
        {isStreakMilestone ? (
          <Crown className='text-emerald-600' fill='#10b981' size={40} />
        ) : (
          <PartyPopper className='text-emerald-600' size={40} />
        )}
      </Animated.View>

      {/* Celebration text */}
      <Text className='mb-1 text-2xl font-bold text-emerald-800'>
        {isStreakMilestone
          ? `${milestoneNumber} Day Milestone!`
          : 'You Did It!'}
      </Text>
      <Text className='text-center text-base text-emerald-600'>
        {isStreakMilestone
          ? `Incredible dedication to "${habitName}"!`
          : `"${habitName}" completed`}
      </Text>
    </View>
  );
}
