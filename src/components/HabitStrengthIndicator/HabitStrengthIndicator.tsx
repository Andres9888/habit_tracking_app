/**
 * HabitStrengthIndicator Component
 * Based on UX Specification Section 4.2
 *
 * Variants: Compact (list), Full (detail), Graph (trend line - premium)
 * States: Starting 🌱 (0-20%), Building 🌿 (20-40%), Developing 🌳 (40-60%),
 *         Strong 💪 (60-80%), Automatic ⚡ (80-100%)
 * Animation: Progress bar fills with spring physics, emoji changes with scale bounce
 * Accessibility: Announces "Meditation habit, 65% strength, Strong level"
 */

import React, { memo, useMemo } from 'react';
import { useAppTheme } from '../../theme';

import type { HabitStrengthIndicatorProps } from './types';
import { buildStrengthLevelConfig } from './constants';
import { getStrengthLevel, getStrengthColor } from './utils';
import { useStrengthAnimation } from './useStrengthAnimation';
import { CompactIndicator } from './CompactIndicator';
import { GraphIndicator } from './GraphIndicator';

function HabitStrengthIndicatorComponent({
  strength,
  strengthLevel,
  variant = 'compact',
  showPercentage = true,
  showLabel = true,
  habitName,
  // historicalData will be used by GraphIndicator in Phase 7: Premium Features
  historicalData: _historicalData = [],
  emojiOverrides,
}: HabitStrengthIndicatorProps) {
  const theme = useAppTheme();
  const level = strengthLevel || getStrengthLevel(strength);
  const levelConfig = useMemo(
    () => buildStrengthLevelConfig(emojiOverrides),
    [emojiOverrides]
  );
  const config = levelConfig[level];

  const { progressBarStyle, emojiStyle } = useStrengthAnimation({
    config,
    habitName,
    level,
    strength,
  });

  const strengthColorFn = useMemo(
    () => () => getStrengthColor(level, theme),
    [level, theme]
  );

  const variantProps = {
    config,
    emojiStyle,
    getStrengthColor: strengthColorFn,
    level,
    progressBarStyle,
    showLabel,
    showPercentage,
    strength,
  };

  if (variant === 'compact') {
    return <CompactIndicator {...variantProps} />;
  }

  if (variant === 'full') {
    return <CompactIndicator {...variantProps} />;
  }

  if (variant === 'graph') {
    return <GraphIndicator />;
  }

  return null;
}

export default memo(HabitStrengthIndicatorComponent);
