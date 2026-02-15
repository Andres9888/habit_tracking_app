/**
 * StrengthProgressBar Component
 * Horizontal progress bar showing habit strength with level indicators
 */

import React, { memo } from 'react';
import { View } from 'react-native';

import type { StrengthProgressBarProps } from './StrengthProgressBar.types';
import {
  getCurrentLevel,
  getNextLevel,
  formatStrengthPercentage,
  SIZE_CONFIG,
} from './StrengthProgressBar.constants';
import { ProgressBarBottomRow } from './ProgressBarBottomRow';
import { ProgressBarRow } from './ProgressBarRow';
import { styles } from './StrengthProgressBar.styles';
import { useStrengthAnimation } from './useStrengthAnimation';

export const StrengthProgressBar = memo(({
  showDividers = true,
  showEmoji = true,
  showLabel = false,
  showNextLevel = true,
  showPercentage = true,
  size = 'default',
  strength,
}: StrengthProgressBarProps) => {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const strengthLabel = formatStrengthPercentage(clampedStrength);
  const currentLevel = getCurrentLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const config = SIZE_CONFIG[size];
  const pointsToNext = nextLevel
    ? Math.round(nextLevel.threshold - clampedStrength)
    : 0;

  const { progressAnimatedStyle, emojiAnimatedStyle } = useStrengthAnimation(
    clampedStrength,
    currentLevel.label
  );

  return (
    <View
      accessible
      accessibilityLabel={`${strengthLabel} strength, ${currentLevel.label} level`}
      accessibilityRole='progressbar'
      style={styles.container}
    >
      <ProgressBarRow
        config={config}
        currentLevel={currentLevel}
        emojiAnimatedStyle={emojiAnimatedStyle}
        nextLevel={nextLevel}
        progressAnimatedStyle={progressAnimatedStyle}
        showDividers={showDividers}
        showEmoji={showEmoji}
        showNextLevel={showNextLevel}
        showPercentage={showPercentage}
        strengthLabel={strengthLabel}
      />
      <ProgressBarBottomRow
        config={config}
        currentLevel={currentLevel}
        nextLevel={nextLevel}
        pointsToNext={pointsToNext}
        showLabel={showLabel}
        showNextLevel={showNextLevel}
      />
    </View>
  );
});

export type { StrengthProgressBarProps } from './StrengthProgressBar.types';
export default StrengthProgressBar;
