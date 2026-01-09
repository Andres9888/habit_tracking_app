/**
 * StrengthProgressBar Component
 * Horizontal progress bar showing habit strength with level indicators
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { StrengthProgressBarProps } from './StrengthProgressBar.types';
import {
  getCurrentLevel,
  getNextLevel,
  formatStrengthPercentage,
  SIZE_CONFIG,
  DIVIDER_POSITIONS,
} from './StrengthProgressBar.constants';
import { useStrengthAnimation } from './useStrengthAnimation';
import { styles } from './StrengthProgressBar.styles';
import { ProgressBarBottomRow } from './ProgressBarBottomRow';

export const StrengthProgressBar = ({
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
      <View style={[styles.topRow, { gap: config.gap }]}>
        {showEmoji && (
          <View
            style={[
              styles.emojiContainer,
              {
                height: config.emojiContainerSize,
                width: config.emojiContainerSize,
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.emoji,
                { fontSize: config.emojiSize },
                emojiAnimatedStyle,
              ]}
            >
              {currentLevel.emoji}
            </Animated.Text>
          </View>
        )}

        <View
          style={[
            styles.barContainer,
            {
              backgroundColor: '#e5e7eb',
              borderRadius: config.barHeight / 2,
              height: config.barHeight,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: currentLevel.color,
                borderRadius: config.barHeight / 2,
              },
              progressAnimatedStyle,
            ]}
          />
          {showDividers &&
            DIVIDER_POSITIONS.map((pos) => (
              <View
                key={pos}
                style={[
                  styles.divider,
                  { height: config.barHeight, left: `${pos}%` },
                ]}
              />
            ))}
        </View>

        {showPercentage && (
          <Text
            style={[
              styles.percentage,
              { color: currentLevel.color, fontSize: config.fontSize },
            ]}
          >
            {strengthLabel}
          </Text>
        )}

        {showNextLevel && nextLevel && (
          <View style={styles.nextLevelContainer}>
            <Text style={[styles.arrow, { fontSize: config.fontSize }]}>→</Text>
            <Text
              style={[styles.nextEmoji, { fontSize: config.emojiSize * 0.85 }]}
            >
              {nextLevel.emoji}
            </Text>
          </View>
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
    </View>
  );
};

export type { StrengthProgressBarProps } from './StrengthProgressBar.types';
export default StrengthProgressBar;
