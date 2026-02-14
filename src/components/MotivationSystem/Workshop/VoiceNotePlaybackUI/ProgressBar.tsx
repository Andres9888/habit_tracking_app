/**
 * ProgressBar Component
 * Seekable progress bar with animated fill for audio playback
 */

import { triggerHaptic } from '@/utils/haptics';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Pressable,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ProgressBarProps } from './types';

export function ProgressBar({
  progress,
  onSeek,
  isDisabled = false,
  reduceMotion = false,
}: ProgressBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const animatedProgress = useSharedValue(progress);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value) {
      animatedProgress.value = reduceMotion
        ? progress
        : withTiming(progress, { duration: 100 });
    }
  }, [progress, reduceMotion, animatedProgress, isDragging]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${animatedProgress.value * 100}%`,
    transform: [{ translateX: -6 }],
  }));

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  }, []);

  const handleSeek = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled || barWidth === 0) return;

      const { locationX } = event.nativeEvent;
      const newProgress = Math.max(0, Math.min(1, locationX / barWidth));

      triggerHaptic('tap');
      animatedProgress.value = newProgress;
      onSeek(newProgress);
    },
    [isDisabled, barWidth, onSeek, animatedProgress]
  );

  const handleTouchStart = useCallback(() => {
    isDragging.value = true;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    isDragging.value = false;
  }, [isDragging]);

  return (
    <Pressable
      accessibilityLabel='Seek through audio'
      accessibilityRole='adjustable'
      className='relative h-6 justify-center'
      disabled={isDisabled}
      onLayout={handleLayout}
      onPress={handleSeek}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {/* Track background */}
      <View className='h-1 w-full rounded-full bg-stone-200' />

      {/* Progress fill */}
      <Animated.View
        className='absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-teal-500'
        style={progressStyle}
      />

      {/* Thumb indicator */}
      <Animated.View
        className='absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-teal-600 shadow-sm'
        style={thumbStyle}
      />
    </Pressable>
  );
}
