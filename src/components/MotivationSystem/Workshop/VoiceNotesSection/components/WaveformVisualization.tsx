/**
 * WaveformVisualization Component
 * Displays an animated waveform during recording
 */

import React, { useEffect } from 'react';
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

export function WaveformVisualization({
  meteringLevel,
  isRecording,
  isPaused,
  reduceMotion = false,
}: WaveformVisualizationProps) {
  const animatedHeights = Array.from({ length: BAR_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSharedValue(0.2)
  );

  useEffect(() => {
    if (!isRecording || isPaused || reduceMotion) {
      for (const height of animatedHeights) {
        height.value = withTiming(0.2, { duration: 200 });
      }
      return;
    }

    for (const [index, height] of animatedHeights.entries()) {
      const variation = Math.sin(
        (index / BAR_COUNT) * Math.PI * 2 + Date.now() / 200
      );
      const targetHeight =
        0.2 + meteringLevel * 0.8 * (0.5 + (0.5 * (1 + variation)) / 2);

      height.value = withTiming(Math.min(1, Math.max(0.2, targetHeight)), {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [meteringLevel, isRecording, isPaused, reduceMotion, animatedHeights]);

  return (
    <View className='h-8 flex-row items-center justify-center gap-0.5'>
      {animatedHeights.map((height, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const animatedStyle = useAnimatedStyle(() => ({
          height: `${height.value * 100}%`,
        }));

        return (
          <Animated.View
            key={index}
            className='w-1 rounded-full bg-teal-500'
            style={animatedStyle}
          />
        );
      })}
    </View>
  );
}
