/**
 * StreakDisplay - Animated streak count with pulsing flame
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { StreakDisplayProps } from '../types';

export function StreakDisplay({ streak, reduceMotion }: StreakDisplayProps) {
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Continuous pulse animation for the flame
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [reduceMotion, flameScale]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <View className='flex-row items-center justify-center gap-3 rounded-2xl p-4'>
      <LinearGradient
        className='absolute inset-0 rounded-2xl'
        colors={['#fffbeb', '#ffedd5']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <Animated.View style={flameAnimatedStyle}>
        <Flame className='text-orange-500' fill='#f97316' size={32} />
      </Animated.View>
      <View className='items-center'>
        <Text className='text-3xl font-bold text-orange-600'>{streak}</Text>
        <Text className='text-sm font-medium text-orange-500'>Day Streak</Text>
      </View>
    </View>
  );
}
