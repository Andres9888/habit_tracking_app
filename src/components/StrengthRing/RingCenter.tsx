/**
 * RingCenter - Content displayed in the center of the ring (emoji or percentage)
 */
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import type { LevelInfo } from './StrengthRing.types';
import { styles } from './StrengthRing.styles';
import { TrendArrow } from './TrendArrow';

interface RingCenterProps {
  showEmoji: boolean;
  showPercentage: boolean;
  levelInfo: LevelInfo;
  strength: number;
  fontSize: number;
  ringSize: number;
  trend?: 'up' | 'down' | 'stable';
  emojiAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export const RingCenter = React.memo(function RingCenter({
  showEmoji,
  showPercentage,
  levelInfo,
  strength,
  fontSize,
  ringSize,
  trend,
  emojiAnimatedStyle,
}: RingCenterProps) {
  return (
    <View style={[styles.centerText, { height: ringSize, width: ringSize }]}>
      {showEmoji ? (
        <Animated.Text
          style={[
            styles.emojiText,
            { fontSize: fontSize * 1.2 },
            emojiAnimatedStyle,
          ]}
        >
          {levelInfo.emoji}
        </Animated.Text>
      ) : showPercentage ? (
        <View style={styles.percentageContainer}>
          <Text
            style={[
              styles.percentageText,
              { color: levelInfo.color, fontSize },
            ]}
          >
            {Math.round(strength)}%
          </Text>
          {trend ? <TrendArrow fontSize={fontSize} trend={trend} /> : null}
        </View>
      ) : null}
    </View>
  );
});
