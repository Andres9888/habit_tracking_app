/**
 * StrengthDecayNudge Component
 * Shows a subtle "weakening" indicator when strength has declined.
 * Communicates decay so users understand why strength dropped.
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { styles } from './StrengthProgressBar.styles';

interface StrengthDecayNudgeProps {
  /** Current strength (0-100) */
  strength: number;
  /** Previous strength value */
  previousStrength: number;
}

export const StrengthDecayNudge = memo(function StrengthDecayNudge({
  strength,
  previousStrength,
}: StrengthDecayNudgeProps) {
  const { isDark } = useThemeColors();
  const delta = Math.round(strength - previousStrength);

  // Only show for meaningful declines (at least -2%)
  if (delta >= -1 || previousStrength <= 0) return null;

  const decayColor = isDark ? '#FCA5A5' : '#DC2626';

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.decayNudge}>
      <Text style={[styles.decayText, { color: decayColor }]}>
        ↓ {Math.abs(delta)}% — complete today to rebuild!
      </Text>
    </Animated.View>
  );
});
