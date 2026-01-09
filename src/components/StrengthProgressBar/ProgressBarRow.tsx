/**
 * ProgressBarRow - Top row containing emoji, bar, percentage, next level
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './StrengthProgressBar.styles';
import {
  DIVIDER_POSITIONS,
  type SizeConfig,
} from './StrengthProgressBar.constants';
import type { ViewStyle } from 'react-native';

interface ProgressBarRowProps {
  config: SizeConfig;
  currentLevel: { emoji: string; color: string };
  emojiAnimatedStyle: ViewStyle;
  nextLevel?: { emoji: string } | null;
  progressAnimatedStyle: ViewStyle;
  showDividers: boolean;
  showEmoji: boolean;
  showNextLevel: boolean;
  showPercentage: boolean;
  strengthLabel: string;
}

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
  );
}
