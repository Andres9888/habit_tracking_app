/**
 * TierUpBadge Component
 * Celebratory badge shown when user reaches a new strength tier.
 * Auto-dismisses after a few seconds.
 */

import React, { memo } from 'react';
import { Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  BounceIn,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { styles } from './StrengthProgressBar.styles';
import type { LevelConfig } from './StrengthProgressBar.constants';

interface TierUpBadgeProps {
  tier: LevelConfig;
}

export const TierUpBadge = memo(function TierUpBadge({ tier }: TierUpBadgeProps) {
  const { isDark } = useThemeColors();

  const bgColor = isDark
    ? `${tier.color}30`
    : `${tier.colorBg}`;

  return (
    <Animated.View
      entering={BounceIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={[styles.tierUpBadge, { backgroundColor: bgColor }]}
    >
      <Text style={{ fontSize: 14 }}>{tier.emoji}</Text>
      <Text style={[styles.tierUpText, { color: tier.color }]}>
        {tier.label} unlocked!
      </Text>
    </Animated.View>
  );
});
