/**
 * ProgressBarBottomRow Component
 * Bottom row with label and next level hint
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './StrengthProgressBar.styles';
import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';

interface ProgressBarBottomRowProps {
  showLabel: boolean;
  showNextLevel: boolean;
  currentLevel: LevelConfig;
  nextLevel: LevelConfig | null;
  pointsToNext: number;
  config: SizeConfig;
}

export const ProgressBarBottomRow: React.FC<ProgressBarBottomRowProps> = ({
  showLabel,
  showNextLevel,
  currentLevel,
  nextLevel,
  pointsToNext,
  config,
}) => {
  if (!showLabel && !(showNextLevel && nextLevel)) return null;

  return (
    <View style={[styles.bottomRow, { marginTop: config.gap / 2 }]}>
      {showLabel ? <Text
          style={[
            styles.label,
            { color: currentLevel.color, fontSize: config.fontSize * 0.9 },
          ]}
        >
          {currentLevel.label}
        </Text> : null}
      {showNextLevel && nextLevel ? <Text style={[styles.nextHint, { fontSize: config.fontSize * 0.85 }]}>
          {pointsToNext}% to {nextLevel.label}
        </Text> : null}
    </View>
  );
};
