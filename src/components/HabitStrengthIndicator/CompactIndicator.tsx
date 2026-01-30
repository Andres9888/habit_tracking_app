/**
 * Compact Variant (for habit list view)
 * Shows emoji, progress bar, and optional percentage
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { styles } from './styles';
import type { IndicatorVariantProps } from './types';

export function CompactIndicator({
  strength,
  config,
  showPercentage,
  getStrengthColor,
  progressBarStyle,
  emojiStyle,
}: IndicatorVariantProps) {
  const theme = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${Math.round(strength)}% strength, ${config.label}`}
      accessibilityRole='progressbar'
      style={styles.compactContainer}
    >
      <Animated.Text style={[styles.compactEmoji, emojiStyle]}>
        {config.emoji}
      </Animated.Text>

      <View
        style={[
          styles.compactBarContainer,
          { backgroundColor: theme.custom.colors.gray[200] },
        ]}
      >
        <Animated.View
          style={[
            styles.compactBar,
            progressBarStyle,
            { backgroundColor: getStrengthColor() },
          ]}
        />
      </View>

      {showPercentage && (
        <Text
          style={[
            theme.custom.typography.bodySmall,
            styles.percentage,
            { color: theme.custom.colors.gray[600] },
          ]}
        >
          {Math.round(strength)}%
        </Text>
      )}
    </View>
  );
}
