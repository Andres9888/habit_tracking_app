/**
 * DayBar Component
 * Individual animated bar for the weekly chart
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
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

function getBgStyle(isBest: boolean, isWorst: boolean, rate: number, colors: ReturnType<typeof useThemeColors>['colors']): { backgroundColor: string; opacity?: number } {
  if (isBest) return { backgroundColor: colors.status.success };
  if (isWorst && rate < 70) return { backgroundColor: colors.status.warning };
  if (rate >= 70) return { backgroundColor: colors.status.success, opacity: 0.7 };
  if (rate >= 50) return { backgroundColor: colors.status.info, opacity: 0.6 };
  return { backgroundColor: colors.status.warning, opacity: 0.7 };
}

export function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
  reduceMotion,
}: DayBarProps) {
  const { colors: themeColors } = useThemeColors();
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

  const bgStyle = getBgStyle(isBest, isWorst, dayStats.rate, themeColors);
  const label = DAY_LABELS_SHORT[dayStats.dayIndex];
  const a11yLabel = `${label}: ${dayStats.rate}% completion${isBest ? ', best day' : ''}${isWorst ? ', needs improvement' : ''}`;

  const labelColor = isBest
    ? themeColors.status.successText
    : isWorst
      ? themeColors.status.warningText
      : themeColors.text.secondary;

  const rateColor = isBest
    ? themeColors.status.successText
    : isWorst
      ? themeColors.status.warningText
      : themeColors.text.tertiary;

  return (
    <View accessibilityLabel={a11yLabel} className='flex-1 items-center'>
      <View className='h-16 w-full items-center justify-end px-0.5'>
        <Animated.View
          className='w-full rounded-t-md'
          style={[barStyle, bgStyle]}
        />
      </View>
      <Text
        className='mt-1 text-xs font-medium'
        style={{ color: labelColor }}
      >
        {label}
      </Text>
      <Text
        className={`text-[9px] ${isBest ? 'font-bold' : isWorst ? 'font-medium' : ''}`}
        style={{ color: rateColor }}
      >
        {dayStats.rate}%
      </Text>
    </View>
  );
}
