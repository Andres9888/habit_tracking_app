/**
 * DayBar Component
 * Individual animated bar for the weekly chart
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { DayStats } from '../types';
import { DAY_LABELS_SHORT, BAR_ANIMATION } from './constants';

interface DayBarProps {
  dayStats: DayStats;
  isBest: boolean;
  isWorst: boolean;
  maxRate: number;
  index: number;
  reduceMotion: boolean;
}

function getBgColor(isBest: boolean, isWorst: boolean, rate: number): string {
  if (isBest) return 'bg-emerald-500';
  if (isWorst && rate < 70) return 'bg-amber-500';
  if (rate >= 70) return 'bg-emerald-500/70';
  if (rate >= 50) return 'bg-blue-500/60';
  return 'bg-amber-500/70';
}

export function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
  reduceMotion,
}: DayBarProps) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  const normalizedHeight = maxRate > 0 ? (dayStats.rate / maxRate) * 100 : 0;
  const minHeight = dayStats.rate > 0 ? 15 : 4;
  const finalHeight = Math.max(normalizedHeight, minHeight);

  useEffect(() => {
    if (reduceMotion) {
      height.value = finalHeight;
      return;
    }

    const delay = index * BAR_ANIMATION.staggerDelay;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: BAR_ANIMATION.fadeInDuration })
    );
    height.value = withDelay(
      delay,
      withSpring(finalHeight, BAR_ANIMATION.springConfig)
    );
  }, [index, finalHeight, reduceMotion]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
    opacity: opacity.value,
  }));

  const bgColor = getBgColor(isBest, isWorst, dayStats.rate);
  const label = DAY_LABELS_SHORT[dayStats.dayIndex];
  const a11yLabel = `${label}: ${dayStats.rate}% completion${isBest ? ', best day' : ''}${isWorst ? ', needs improvement' : ''}`;

  return (
    <View accessibilityLabel={a11yLabel} className='flex-1 items-center'>
      <View className='h-16 w-full items-center justify-end px-0.5'>
        <Animated.View
          className={`w-full rounded-t-md ${bgColor}`}
          style={barStyle}
        />
      </View>
      <Text
        className={`mt-1 text-xs font-medium ${
          isBest
            ? 'text-emerald-600'
            : isWorst
              ? 'text-amber-600'
              : 'text-stone-500'
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-[9px] ${
          isBest
            ? 'font-bold text-emerald-700'
            : isWorst
              ? 'font-medium text-amber-700'
              : 'text-stone-400'
        }`}
      >
        {dayStats.rate}%
      </Text>
    </View>
  );
}
