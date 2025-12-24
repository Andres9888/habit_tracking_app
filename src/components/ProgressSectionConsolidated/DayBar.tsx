/**
 * DayBar Component
 *
 * Individual animated bar for the WeeklyPatternChart.
 * Shows a single day's completion rate with staggered animation.
 *
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

/** Single character day labels */
const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Delay between each bar's animation start (ms) */
const BAR_STAGGER_DELAY = 50;

/** Bar dimensions per spec */
const BAR_WIDTH = 20;
const BAR_MAX_HEIGHT = 40;

/**
 * Get bar color based on performance rate and best/worst status
 */
function getBarColor(rate: number, isBest: boolean, isWorst: boolean): string {
  if (isBest) return '#10b981'; // emerald-500
  if (isWorst) return '#fbbf24'; // amber-400
  if (rate >= 70) return '#a8a29e'; // stone-400
  if (rate >= 50) return '#d6d3d1'; // stone-300
  return '#e7e5e4'; // stone-200
}

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
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, [index, reduceMotion, scaleY, opacity]);

  const barStyle = useAnimatedStyle(() => ({
    height: barHeight,
    opacity: opacity.value,
    transform: [{ scaleY: scaleY.value }],
  }));

  const barColor = getBarColor(rate, isBest, isWorst);

  // Day label styling
  const labelColor = isBest
    ? 'text-emerald-600 font-bold'
    : isWorst
      ? 'text-amber-600 font-bold'
      : 'text-stone-500';

  const accessibilityLabel = `${DAY_LABELS_SHORT[dayIndex]}: ${rate}% completion${isBest ? ', best day' : ''}${isWorst ? ', focus day' : ''}`;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='items-center'
      style={{ width: BAR_WIDTH }}
    >
      {/* Bar container - aligned to bottom */}
      <View
        className='items-center justify-end'
        style={{ height: BAR_MAX_HEIGHT }}
      >
        <Animated.View
          className='rounded-t-sm'
          style={[
            {
              backgroundColor: barColor,
              transformOrigin: 'bottom',
              width: BAR_WIDTH - 4,
            },
            barStyle,
          ]}
        />
      </View>
      {/* Day label */}
      <Text className={`mt-1 text-[10px] ${labelColor}`}>
        {DAY_LABELS_SHORT[dayIndex]}
      </Text>
    </View>
  );
});

export default DayBar;
