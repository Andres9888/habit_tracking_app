/**
 * ProgressBarRow - Top row containing emoji, bar, percentage, next level
 * Enhanced with gradient fill and glow effect at leading edge
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';

import type { ProgressBarRowProps } from './ProgressBarRow.types';
import { GradientBar } from './GradientBar';
import { getGradientColors } from './ProgressBarRow.helpers';
import { styles } from './StrengthProgressBar.styles';

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
          <Text style={[styles.arrow, { fontSize: config.fontSize }]}>→</Text>
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
