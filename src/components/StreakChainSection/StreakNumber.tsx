/**
 * StreakNumber Component
 * Large animated streak count display
 */

import React from 'react';
import { Text } from 'react-native';

import Animated from 'react-native-reanimated';

interface StreakNumberProps {
  currentStreak: number;
  textColor: string;
  animatedStyle: object;
}

export function StreakNumber({
  currentStreak,
  textColor,
  animatedStyle,
}: StreakNumberProps) {
  return (
    <Animated.View className='mb-2 items-center' style={animatedStyle}>
      <Text className={`text-6xl font-bold tracking-tighter ${textColor}`}>
        {currentStreak}
      </Text>
      <Text className='text-sm text-stone-500'>
        {currentStreak === 1 ? 'day' : 'days'}
      </Text>
    </Animated.View>
  );
}
