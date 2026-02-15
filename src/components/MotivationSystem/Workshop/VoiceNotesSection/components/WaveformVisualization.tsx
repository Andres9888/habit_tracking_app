/**
 * WaveformVisualization Component
 * Displays an animated waveform during recording
 *
 * Refactored to properly follow React's rules of hooks by using
 * a separate WaveformBar component for each bar.
 */

import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface WaveformVisualizationProps {
  meteringLevel: number;
  isRecording: boolean;
  isPaused: boolean;
  reduceMotion?: boolean;
}

const BAR_COUNT = 20;

interface WaveformBarProps {
  index: number;
  meteringLevel: number;
  isActive: boolean;
  reduceMotion: boolean;
}

/**
 * Individual waveform bar with its own animation state.
 * Each bar is a separate component to comply with React's rules of hooks.
 */
function WaveformBar({
  index,
  meteringLevel,
  isActive,
  reduceMotion,
}: WaveformBarProps) {
  const height = useSharedValue(0.2);

  useEffect(() => {
    if (!isActive || reduceMotion) {
      height.value = withTiming(0.2, { duration: 200 });
      return;
    }

    const variation = Math.sin(
      (index / BAR_COUNT) * Math.PI * 2 + Date.now() / 200
    );
    const targetHeight =
      0.2 + meteringLevel * 0.8 * (0.5 + (0.5 * (1 + variation)) / 2);

    height.value = withTiming(Math.min(1, Math.max(0.2, targetHeight)), {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
  }, [meteringLevel, isActive, reduceMotion, index, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${(height.value ?? 0.2) * 100}%`,
  }));

  return (
    <Animated.View
      className='w-1 rounded-full bg-teal-500'
      style={animatedStyle}
    />
  );
}

export function WaveformVisualization({
  meteringLevel,
  isRecording,
  isPaused,
  reduceMotion = false,
}: WaveformVisualizationProps) {
  // Generate bar indices once (stable across renders)
  const barIndices = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, (_, i) => i);
  }, []);

  const isActive = isRecording && !isPaused;

  return (
    <View className='h-8 flex-row items-center justify-center gap-0.5'>
      {barIndices.map((index) => (
        <WaveformBar
          key={index}
          index={index}
          isActive={isActive}
          meteringLevel={meteringLevel}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}
