/**
 * StrengthProgressBar Component
 * Horizontal progress bar showing habit strength with level indicators.
 * Features: tooltip explanation, tier-up celebration, decay nudge, dark mode.
 */

import React, { memo, useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { StrengthProgressBarProps } from './StrengthProgressBar.types';
import {
  getCurrentLevel,
  getNextLevel,
  formatStrengthPercentage,
  SIZE_CONFIG,
} from './StrengthProgressBar.constants';
import { useStrengthAnimation } from './useStrengthAnimation';
import { useTierCelebration } from './useTierCelebration';
import { styles } from './StrengthProgressBar.styles';
import { ProgressBarBottomRow } from './ProgressBarBottomRow';
import { ProgressBarRow } from './ProgressBarRow';
import { StrengthTooltip } from './StrengthTooltip';
import { StrengthDecayNudge } from './StrengthDecayNudge';
import { TierUpBadge } from './TierUpBadge';

export const StrengthProgressBar = memo(({
  previousStrength,
  showDividers = true,
  showEmoji = true,
  showInfo = false,
  showLabel = false,
  showNextLevel = true,
  showPercentage = true,
  size = 'default',
  strength,
}: StrengthProgressBarProps) => {
  const { colors: themeColors } = useThemeColors();
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

  const { showTierUp, newTier } = useTierCelebration(clampedStrength);

  // Tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const toggleTooltip = useCallback(() => setTooltipVisible((v) => !v), []);

  return (
    <View
      accessible
      accessibilityLabel={`${strengthLabel} strength, ${currentLevel.label} level`}
      accessibilityRole='progressbar'
      style={styles.container}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
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
        </View>
        {showInfo && (
          <Pressable
            accessibilityLabel='What is habit strength?'
            accessibilityRole='button'
            hitSlop={8}
            onPress={toggleTooltip}
            style={[
              styles.infoButton,
              { backgroundColor: themeColors.gray[200] },
            ]}
          >
            <Text
              style={[styles.infoText, { color: themeColors.text.secondary }]}
            >
              ?
            </Text>
          </Pressable>
        )}
      </View>
      <ProgressBarBottomRow
        config={config}
        currentLevel={currentLevel}
        nextLevel={nextLevel}
        pointsToNext={pointsToNext}
        showLabel={showLabel}
        showNextLevel={showNextLevel}
      />

      {/* Tier-up celebration badge */}
      {showTierUp && newTier && <TierUpBadge tier={newTier} />}

      {/* Decay nudge when strength is declining */}
      {previousStrength !== undefined && (
        <StrengthDecayNudge
          previousStrength={previousStrength}
          strength={clampedStrength}
        />
      )}

      {/* Info tooltip modal */}
      <StrengthTooltip
        currentStrength={clampedStrength}
        onClose={toggleTooltip}
        visible={tooltipVisible}
      />
    </View>
  );
});

export type { StrengthProgressBarProps } from './StrengthProgressBar.types';
export default StrengthProgressBar;
