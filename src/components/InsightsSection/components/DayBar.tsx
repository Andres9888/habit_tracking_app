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
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

/**
 * Get background hex color based on day statistics
 */
function getBarHexColor(
  isBest: boolean,
  isWorst: boolean,
  rate: number,
  colors: { gray: { 200: string; 300: string } }
): string {
  if (isBest) return '#10b981'; // emerald-500
  if (isWorst && rate < 70) return '#fbbf24'; // amber-400
  if (rate >= 80) return '#34d399'; // emerald-400
  if (rate >= 60) return '#60a5fa'; // blue-400
  if (rate >= 40) return colors.gray[300];
  return colors.gray[200];
}

export function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
}: DayBarProps) {
  const { colors } = useThemeColors();
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const normalizedHeight = maxRate > 0 ? (dayStats.rate / maxRate) * 100 : 0;
  const minHeight = dayStats.rate > 0 ? 15 : 4;
  const finalHeight = Math.max(normalizedHeight, minHeight);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 200 }));
    height.value = withDelay(
      index * 50 + 100,
      withSpring(finalHeight, springs.celebration)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [index, finalHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
    opacity: opacity.value,
  }));

  const bgHex = getBarHexColor(isBest, isWorst, dayStats.rate, colors);
  const labelColor = isBest
    ? '#059669' // emerald-600
    : isWorst
      ? '#d97706' // amber-600
      : colors.text.secondary;
  const rateColor = isBest
    ? '#047857' // emerald-700
    : isWorst
      ? '#b45309' // amber-700
      : colors.text.tertiary;

  return (
    <View className='flex-1 items-center'>
      <View className='h-20 w-full items-center justify-end px-0.5'>
        <Animated.View
          className='w-full rounded-t-md'
          style={[{ backgroundColor: bgHex }, barStyle]}
        />
      </View>
      <Text
        className={`mt-1.5 text-xs font-medium`}
        style={{ color: labelColor }}
      >
        {DAY_LABELS_SHORT[dayStats.dayIndex]}
      </Text>
      <Text
        className={`text-[10px] ${
          isBest
            ? 'font-bold'
            : isWorst
              ? 'font-medium'
              : ''
        }`}
        style={{ color: rateColor }}
      >
        {dayStats.rate}%
      </Text>
    </View>
  );
}
