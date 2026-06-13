/**
 * LevelLabel - Shows level emoji, label, and weekly change below the ring
 */
import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { LevelInfo } from './StrengthRing.types';
import { styles } from './StrengthRing.styles';

interface LevelLabelProps {
  levelInfo: LevelInfo;
  fontSize: number;
  weeklyChange?: number;
}

export const LevelLabel = React.memo(function LevelLabel({
  levelInfo,
  fontSize,
  weeklyChange,
}: LevelLabelProps) {
  return (
    <View style={styles.levelContainer}>
      <Text style={[styles.levelEmoji, { fontSize: fontSize * 0.9 }]}>
        {levelInfo.emoji}
      </Text>
      <Text
        style={[
          styles.levelText,
          { color: levelInfo.color, fontSize: fontSize * 0.75 },
        ]}
      >
        {levelInfo.label}
      </Text>
      {weeklyChange !== undefined && weeklyChange !== 0 ? <Text
          style={[
            styles.changeText,
            {
              color: weeklyChange > 0 ? colors.success : colors.error,
              fontSize: fontSize * 0.65,
            },
          ]}
        >
          {weeklyChange > 0 ? '+' : ''}
          {weeklyChange}%
        </Text> : null}
    </View>
  );
});
