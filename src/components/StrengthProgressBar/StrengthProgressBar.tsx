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
import { useStrengthAnimation } from './useStrengthAnimation';
import { styles } from './StrengthProgressBar.styles';
import { ProgressBarBottomRow } from './ProgressBarBottomRow';
import { ProgressBarRow } from './ProgressBarRow';

const StrengthProgressBarInner = ({
  showDividers = true,
  showEmoji = true,
  showLabel = false,
  showNextLevel = true,
  showPercentage = true,
  size = 'default',
  strength,
  emojiOverrides,
}: StrengthProgressBarProps) => {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const strengthLabel = formatStrengthPercentage(clampedStrength);
  const currentLevel = getCurrentLevel(clampedStrength, emojiOverrides);
  const nextLevel = getNextLevel(clampedStrength, emojiOverrides);
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
        strength={clampedStrength}
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
};
StrengthProgressBarInner.displayName = 'StrengthProgressBar';
export const StrengthProgressBar = memo(StrengthProgressBarInner);

export type { StrengthProgressBarProps } from './StrengthProgressBar.types';
export default StrengthProgressBar;
