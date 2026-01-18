/**
 * StreakIndicator Component (Story 1.4)
 *
 * Displays current and best streak with milestone badges
 * Variants: Compact (for habit list), Full (for detail screen)
 */

import React from 'react';
import type { StreakIndicatorProps } from './StreakIndicator.types';
import { useStreakIndicator } from './useStreakIndicator';
import { CompactStreakView } from './CompactStreakView';
import { FullStreakView } from './FullStreakView';

export type { StreakIndicatorProps } from './StreakIndicator.types';

export function StreakIndicator({
  currentStreak,
  bestStreak,
  compact = false,
  onMilestone,
  accessibilityLabel,
}: StreakIndicatorProps) {
  const {
    currentMilestone,
    animatedStyle,
    getFireColor,
    getAccessibilityLabel,
  } = useStreakIndicator({
    accessibilityLabel,
    bestStreak,
    currentStreak,
    onMilestone,
  });

  const fireColor = getFireColor();
  const a11yLabel = getAccessibilityLabel();

  if (compact) {
    return (
      <CompactStreakView
        accessibilityLabel={a11yLabel}
        animatedStyle={animatedStyle}
        currentMilestone={currentMilestone}
        currentStreak={currentStreak}
        fireColor={fireColor}
      />
    );
  }

  return (
    <FullStreakView
      accessibilityLabel={a11yLabel}
      animatedStyle={animatedStyle}
      bestStreak={bestStreak}
      currentMilestone={currentMilestone}
      currentStreak={currentStreak}
      fireColor={fireColor}
    />
  );
}

export default StreakIndicator;
