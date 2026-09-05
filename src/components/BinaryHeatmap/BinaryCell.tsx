/**
 * BinaryCell Component
 *
 * Individual cell in the GitHub-style binary heatmap.
 * Displays a colored square: done = habit color, missed = gray.
 *
 * Cell states: done, missed, today (ring), future (faded), beforeCreation
 */

import React, { memo } from 'react';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import type { BinaryCellProps } from './types';
import { getCellState, getBinaryCellAccessibilityLabel } from './utils';
import { getBackgroundColor } from './BinaryCell.helpers';
import { ANIMATION, COLORS } from './constants';
import { styles } from './BinaryCell.styles';

export const BinaryCell = memo(function BinaryCell({
  day,
  index,
  habitColor,
}: BinaryCellProps) {
  const reduceMotion = useReducedMotion();
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
  const bgColor = getBackgroundColor(cellState, day, habitColor);
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
