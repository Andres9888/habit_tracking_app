/**
 * BinaryCell Component
 *
 * Individual cell in the GitHub-style binary heatmap.
 */

import React, { memo, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

import type { BinaryCellProps, BinaryCellState } from './types';
import { getCellState, getBinaryCellAccessibilityLabel } from './utils';
import { ANIMATION, COLORS } from './constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { styles } from './BinaryCell.styles';

function getBackgroundColor(
  cellState: BinaryCellState,
  day: NonNullable<BinaryCellProps['day']>,
  habitColor: string
): string {
  switch (cellState) {
    case 'done': {
      return habitColor;
    }
    case 'today': {
      return day.completed ? habitColor : 'transparent';
    }
    case 'missed': {
      return COLORS.CELL_EMPTY;
    }
    case 'future': {
      return COLORS.CELL_FUTURE;
    }
    case 'beforeCreation': {
      return COLORS.CELL_BEFORE_CREATION;
    }
    default: {
      return COLORS.CELL_EMPTY;
    }
  }
}

export const BinaryCell = memo(function BinaryCell({
  day,
  index,
  habitColor,
  onPress,
}: BinaryCellProps) {
  const scale = useSharedValue(1);
  const reduceMotion = useReduceMotion();
  const staggerDelay = reduceMotion ? 0 : index * ANIMATION.CELL_STAGGER_DELAY;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (day && !day.isFuture && !day.isBeforeCreation && !reduceMotion) {
      scale.value = withSpring(ANIMATION.TAP_SCALE, { damping: 15 });
    }
  }, [day, reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 15 });
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    if (day && onPress && !day.isFuture && !day.isBeforeCreation)
      onPress(day.date, day.completed);
  }, [day, onPress]);

  const accessibilityLabel = getBinaryCellAccessibilityLabel(day);
  const fadeInAnimation = reduceMotion
    ? undefined
    : FadeIn.delay(staggerDelay).duration(ANIMATION.CELL_FADE_DURATION);

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
  const bgColor = getBackgroundColor(cellState, day, habitColor);
  const isInteractive = !day.isFuture && !day.isBeforeCreation;

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
        cellState === 'today' && {
          backgroundColor: day.completed ? bgColor : COLORS.CARD_BACKGROUND,
          borderColor: habitColor,
          borderWidth: COLORS.TODAY_RING_WIDTH,
        },
      ]}
    />
  );
});

export default BinaryCell;
