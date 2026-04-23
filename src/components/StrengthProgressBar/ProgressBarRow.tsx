/**
 * ProgressBarRow - Top row containing emoji, bar, percentage, next level
 * Growth emoji renders inside a LoL-style rank tile (bronze → diamond).
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './StrengthProgressBar.styles';
import type { ProgressBarRowProps } from './ProgressBarRow.types';
import { getGradientColors } from './ProgressBarRow.helpers';
import { GradientBar } from './GradientBar';
import { RankEmojiTile } from '../HabitCard/components/RankEmojiTile';

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
  strength,
  strengthLabel,
}: ProgressBarRowProps) {
  return (
    <View style={[styles.topRow, { gap: config.gap }]}>
      {showEmoji ? (
        <Animated.View
          style={[
            styles.emojiContainer,
            {
              height: config.emojiContainerSize,
              width: config.emojiContainerSize,
            },
            emojiAnimatedStyle,
          ]}
        >
          <RankEmojiTile
            icon={currentLevel.emoji}
            size={config.emojiContainerSize}
            strength={strength}
          />
        </Animated.View>
      ) : null}

      <GradientBar
        barHeight={config.barHeight}
        gradientColors={getGradientColors(currentLevel.color)}
        progressAnimatedStyle={progressAnimatedStyle}
        showDividers={showDividers}
      />

      {showPercentage ? (
        <Text
          style={[
            styles.percentage,
            { color: currentLevel.color, fontSize: config.fontSize },
          ]}
        >
          {strengthLabel}
        </Text>
      ) : null}

      {showNextLevel && nextLevel ? (
        <View style={styles.nextLevelContainer}>
          <Text style={[styles.arrow, { fontSize: config.fontSize }]}>→</Text>
          <Text
            style={[styles.nextEmoji, { fontSize: config.emojiSize * 0.85 }]}
          >
            {nextLevel.emoji}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
