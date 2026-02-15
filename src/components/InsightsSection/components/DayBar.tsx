/**
 * DayBar Component
 * Animated bar showing completion rate for a day of the week
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { DayBarProps } from '../InsightsSection.types';
import { DAY_LABELS_SHORT } from '../InsightsSection.constants';

/**
 * Get background color class based on day statistics
 */
function getBarColorClass(
  isBest: boolean,
  isWorst: boolean,
  rate: number
): string {
  if (isBest) return 'bg-emerald-500';
  if (isWorst && rate < 70) return 'bg-amber-400';
  if (rate >= 80) return 'bg-emerald-400';
  if (rate >= 60) return 'bg-blue-400';
  if (rate >= 40) return 'bg-stone-300';
  return 'bg-stone-200';
}

export function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
}: DayBarProps) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const normalizedHeight = maxRate > 0 ? (dayStats.rate / maxRate) * 100 : 0;
  const minHeight = dayStats.rate > 0 ? 15 : 4;
  const finalHeight = Math.max(normalizedHeight, minHeight);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 200 }));
    height.value = withDelay(
      index * 50 + 100,
      withSpring(finalHeight, { damping: 12 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [index, finalHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
    opacity: opacity.value,
  }));

  const bgColor = getBarColorClass(isBest, isWorst, dayStats.rate);

  return (
    <View className='flex-1 items-center'>
      <View className='h-20 w-full items-center justify-end px-0.5'>
        <Animated.View
          className={`w-full rounded-t-md ${bgColor}`}
          style={barStyle}
        />
      </View>
      <Text
        className={`mt-1.5 text-xs font-medium ${
          isBest
            ? 'text-emerald-600'
            : isWorst
              ? 'text-amber-600'
              : 'text-stone-500'
        }`}
      >
        {DAY_LABELS_SHORT[dayStats.dayIndex]}
      </Text>
      <Text
        className={`text-[10px] ${
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
