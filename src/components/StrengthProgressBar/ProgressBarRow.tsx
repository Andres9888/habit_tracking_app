/**
 * ProgressBarRow - Top row containing emoji, bar, percentage, next level
 * Enhanced with gradient fill and glow effect at leading edge
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { styles } from './StrengthProgressBar.styles';
import type { ProgressBarRowProps } from './ProgressBarRow.types';
import { getGradientColors } from './ProgressBarRow.helpers';
import { GradientBar } from './GradientBar';

export function ProgressBarRow({
  config,
  currentLevel,
  emojiAnimatedStyle,
  nextLevel,
  progressAnimatedStyle,
  showDividers,
  showEmoji,
  showNextLevel,
  showPercentage,
  strengthLabel,
}: ProgressBarRowProps) {
  const { colors: themeColors } = useThemeColors();
  return (
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

      <GradientBar
        barHeight={config.barHeight}
        gradientColors={getGradientColors(currentLevel.color)}
        progressAnimatedStyle={progressAnimatedStyle}
        showDividers={showDividers}
      />

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
          <Text
            style={[
              styles.arrow,
              { color: themeColors.text.tertiary, fontSize: config.fontSize },
            ]}
          >
            →
          </Text>
          <Text
            style={[styles.nextEmoji, { fontSize: config.emojiSize * 0.85 }]}
          >
            {nextLevel.emoji}
          </Text>
        </View>
      )}
    </View>
  );
}
