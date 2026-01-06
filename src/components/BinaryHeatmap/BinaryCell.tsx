/**
 * BinaryCell Component
 *
 * Individual cell in the GitHub-style binary heatmap.
 * Displays a simple colored square (done = habit color, missed = gray).
 *
 * Cell states:
 * - done: Habit completed (habit color)
 * - missed: Habit not completed (gray)
 * - today: Current day (ring outline in habit color)
 * - future: Future date (faded)
 * - beforeCreation: Before habit was created (very faded)
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

import type { BinaryCellProps } from './types';
import { getCellState, getBinaryCellAccessibilityLabel } from './utils';
import {
  CELL_SIZE,
  CELL_BORDER_RADIUS,
  ANIMATION,
  COLORS,
  FOCUS,
} from './constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * BinaryCell - A single cell in the binary heatmap grid
 *
 * This component renders a small square that represents a single day
 * in the habit tracking grid. It uses binary (on/off) visualization:
 * - Completed days show in the habit's accent color
 * - Missed days show in gray
 * - Today has a ring outline
 * - Future dates are faded
 */
export const BinaryCell = memo(function BinaryCell({
  day,
  index,
  habitColor,
  onPress,
}: BinaryCellProps) {
  const scale = useSharedValue(1);
  const reduceMotion = useReduceMotion();

  // Calculate animation delay based on cell position
  const staggerDelay = reduceMotion ? 0 : index * ANIMATION.CELL_STAGGER_DELAY;

  // Animated scale style for tap feedback
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Handle press in - scale down for tap feedback
  const handlePressIn = useCallback(() => {
    if (day && !day.isFuture && !day.isBeforeCreation && !reduceMotion) {
      scale.value = withSpring(ANIMATION.TAP_SCALE, { damping: 15 });
    }
  }, [day, reduceMotion, scale]);

  // Handle press out - scale back to normal
  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  }, [reduceMotion, scale]);

  // Handle press - call onPress callback
  const handlePress = useCallback(() => {
    if (day && onPress && !day.isFuture && !day.isBeforeCreation) {
      onPress(day.date, day.completed);
    }
  }, [day, onPress]);

  // Generate accessibility label
  const accessibilityLabel = getBinaryCellAccessibilityLabel(day);

  // Fade-in animation (respects reduced motion)
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

  // Determine the visual state
  const cellState = getCellState(day);

  // Get the background color based on state
  const getBackgroundColor = (): string => {
    switch (cellState) {
      case 'done':
        return habitColor;
      case 'today':
        return day.completed ? habitColor : 'transparent';
      case 'missed':
        return COLORS.CELL_EMPTY;
      case 'future':
        return COLORS.CELL_FUTURE;
      case 'beforeCreation':
        return COLORS.CELL_BEFORE_CREATION;
      default:
        return COLORS.CELL_EMPTY;
    }
  };

  // Determine if this cell is interactive (can be pressed)
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
          { backgroundColor: getBackgroundColor() },
          cellState === 'future' && styles.futureCell,
        ]}
      />
    );
  }

  // Interactive cells (done, missed, today)
  // Simplified rendering - apply background directly to avoid nested View issues
  const bgColor = getBackgroundColor();

  return (
    <Animated.View
      accessible
      accessibilityHint={day.isToday ? 'Today' : 'Tap to toggle completion'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: day.completed }}
      entering={fadeInAnimation}
      style={[
        styles.cell,
        styles.cellInner,
        { backgroundColor: bgColor },
        // Today ring effect
        cellState === 'today' && {
          borderColor: habitColor,
          borderWidth: COLORS.TODAY_RING_WIDTH,
          backgroundColor: day.completed ? bgColor : COLORS.CARD_BACKGROUND,
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    height: CELL_SIZE,
    justifyContent: 'center',
    width: CELL_SIZE,
  },
  cellInner: {
    borderRadius: CELL_BORDER_RADIUS,
    height: CELL_SIZE,
    width: CELL_SIZE,
  },
  futureCell: {
    opacity: 0.4,
  },
  // Web-specific focus styles for keyboard navigation
  webFocus: {
    borderColor: FOCUS.RING_COLOR,
    borderRadius: CELL_BORDER_RADIUS + FOCUS.RING_OFFSET,
    borderWidth: FOCUS.RING_WIDTH,
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  },
  // Web-specific hover styles (applied via spread)
  webHover: {
    cursor: 'pointer',
  },
});

export default BinaryCell;
