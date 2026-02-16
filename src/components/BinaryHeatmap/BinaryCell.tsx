/**
 * BinaryCell Component
 *
 * Individual cell in the GitHub-style binary heatmap.
 * Displays a colored square: done = habit color, missed = gray.
 *
 * Cell states: done, missed, today (ring), future (faded), beforeCreation
 *
 * Accessibility improvements:
 * - Theme-aware colors for dark mode visibility
 * - Visual indicator (checkmark) for colorblind accessibility
 * - Enhanced screen reader labels
 * - Pressable cells with onPress callback
 */

import React, { memo } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { View, Pressable } from 'react-native';

import type { BinaryCellProps } from './types';
import { getCellState, getBinaryCellAccessibilityLabel } from './utils';
import { getBackgroundColor } from './BinaryCell.helpers';
import { ANIMATION, CELL_SIZE } from './constants';
import { styles } from './BinaryCell.styles';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useHeatmapColors } from './themeAwareColors';

/**
 * Checkmark indicator for completed cells
 * Provides visual distinction beyond color for colorblind accessibility
 */
const CheckmarkIcon = memo(function CheckmarkIcon({ color }: { color: string }) {
  return (
    <View
      style={[
        styles.checkmarkContainer,
        {
          width: CELL_SIZE,
          height: CELL_SIZE,
        },
      ]}
    >
      <Animated.Text style={[styles.checkmarkText, { color }]}>✓</Animated.Text>
    </View>
  );
});

export const BinaryCell = memo(function BinaryCell({
  day,
  index,
  habitColor,
  onPress,
}: BinaryCellProps) {
  const reduceMotion = useReduceMotion();
  const colors = useHeatmapColors();
  const staggerDelay = reduceMotion ? 0 : index * ANIMATION.CELL_STAGGER_DELAY;
  const accessibilityLabel = getBinaryCellAccessibilityLabel(day);
  const fadeInAnimation = reduceMotion
    ? undefined
    : FadeIn.delay(staggerDelay).duration(ANIMATION.CELL_FADE_DURATION);

  // Empty padding cell (null day)
  if (day === null) {
    return (
      <Animated.View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        entering={fadeInAnimation}
        style={styles.cell}
      />
    );
  }

  const cellState = getCellState(day);
  // Use theme-aware colors instead of hardcoded COLORS
  const bgColor = getBackgroundColor(cellState, day, habitColor, colors);
  const isInteractive = !day.isFuture && !day.isBeforeCreation;

  // Non-interactive cells (future, beforeCreation)
  if (!isInteractive) {
    return (
      <Animated.View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        entering={fadeInAnimation}
        style={[
          styles.cell,
          styles.cellInner,
          { backgroundColor: bgColor },
          cellState === 'future' && styles.futureCell,
        ]}
      />
    );
  }

  // Interactive cells (done, missed, today)
  const handlePress = () => {
    onPress?.(day.date, day.completed);
  };

  return (
    <Pressable
      accessible
      accessibilityHint={day.isToday ? 'Today' : 'Tap to toggle completion'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: day.completed }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.cell,
        {
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
      ]}
    >
      <Animated.View
        entering={fadeInAnimation}
        style={[
          styles.cellInner,
          { backgroundColor: bgColor },
          cellState === 'today' && {
            backgroundColor: day.completed ? bgColor : colors.cardBackground,
            borderColor: habitColor,
            borderWidth: colors.todayRingWidth,
          },
        ]}
      >
        {/* Add checkmark for completed cells - colorblind accessibility */}
        {(cellState === 'done' || (cellState === 'today' && day.completed)) && (
          <CheckmarkIcon color={getCheckmarkColor(habitColor)} />
        )}
      </Animated.View>
    </Pressable>
  );
});

/**
 * Determine checkmark color based on background
 * Uses white for dark backgrounds, black for light backgrounds
 */
function getCheckmarkColor(habitColor: string): string {
  const isDarkColor = isColorDark(habitColor);
  return isDarkColor ? '#FFFFFF' : '#000000';
}

/**
 * Simple check if a color is dark
 * Converts hex to RGB and calculates luminance
 */
function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export default BinaryCell;
