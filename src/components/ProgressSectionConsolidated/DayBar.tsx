/**
 * DayBar Component - Individual animated bar for WeeklyPatternChart
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  DAY_LABELS_SHORT,
  BAR_STAGGER_DELAY,
  BAR_WIDTH,
  BAR_MAX_HEIGHT,
  getBarColor,
  getDayLabelColor,
  isDayLabelBold,
} from './DayBar.constants';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

export interface DayBarProps {
  dayIndex: number;
  rate: number;
  isBest: boolean;
  isWorst: boolean;
  maxRate: number;
  index: number;
  reduceMotion: boolean;
}

/**
 * Individual animated day bar
 * Memoized to prevent unnecessary re-renders when sibling bars update
 */
export const DayBar = React.memo(function DayBar({
  dayIndex,
  rate,
  isBest,
  isWorst,
  maxRate,
  index,
  reduceMotion,
}: DayBarProps) {
  const { colors } = useThemeColors();
  const scaleY = useSharedValue(reduceMotion ? 1 : 0);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  // Calculate normalized height (0-1 range)
  const normalizedHeight = maxRate > 0 ? rate / maxRate : 0;
  // Ensure minimum visible height for non-zero values
  const minHeightRatio = rate > 0 ? 0.15 : 0.05;
  const finalHeightRatio = Math.max(normalizedHeight, minHeightRatio);
  const barHeight = finalHeightRatio * BAR_MAX_HEIGHT;

  useEffect(() => {
    if (reduceMotion) {
      scaleY.value = 1;
      opacity.value = 1;
      return;
    }

    const delay = index * BAR_STAGGER_DELAY;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
    );

    scaleY.value = withDelay(
      delay,
      withSpring(1, springs.celebration)
    );
  }, [index, reduceMotion, scaleY, opacity]);

  const barStyle = useAnimatedStyle(() => ({
    height: barHeight,
    opacity: opacity.value,
    transform: [{ scaleY: scaleY.value }],
  }));

  const label = `${DAY_LABELS_SHORT[dayIndex]}: ${rate}%${isBest ? ', best day' : ''}${isWorst ? ', focus day' : ''}`;

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole='text'
      className='items-center'
      style={{ width: BAR_WIDTH }}
    >
      <View
        className='items-center justify-end'
        style={{ height: BAR_MAX_HEIGHT }}
      >
        <Animated.View
          className='rounded-t-sm'
          style={[
            {
              backgroundColor: getBarColor(rate, isBest, isWorst, colors.gray, colors.status.success),
              transformOrigin: 'bottom',
              width: BAR_WIDTH - 4,
            },
            barStyle,
          ]}
        />
      </View>
      <Text
        className={`mt-1 text-[10px] ${isDayLabelBold(isBest, isWorst) ? 'font-bold' : ''}`}
        style={{ color: getDayLabelColor(isBest, isWorst, colors.text.secondary, colors.status.successText) }}
      >
        {DAY_LABELS_SHORT[dayIndex]}
      </Text>
    </View>
  );
});

export default DayBar;
