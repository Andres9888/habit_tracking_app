/**
 * Full Variant (for habit detail view)
 * Shows header with emoji, label, percentage, progress bar, and description
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../theme';
import { styles } from './styles';
import type { IndicatorVariantProps } from './types';

export function FullIndicator({
  strength,
  config,
  showPercentage,
  showLabel = true,
  getStrengthColor,
  progressBarStyle,
  emojiStyle,
}: IndicatorVariantProps) {
  const theme = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${Math.round(strength)}% strength, ${config.label} level. ${config.description}`}
      accessibilityRole='progressbar'
      style={styles.fullContainer}
    >
      {showLabel ? <View style={styles.fullHeader}>
          <View style={styles.fullLabelContainer}>
            <Text style={[styles.fullEmoji, emojiStyle]}>{config.emoji}</Text>
            <Text
              style={[
                theme.custom.typography.heading3,
                { color: theme.custom.colors.gray[900] },
              ]}
            >
              {config.label}
            </Text>
          </View>

          {showPercentage ? <Text
              style={[
                theme.custom.typography.heading2,
                {
                  color: getStrengthColor(),
                  fontFamily: theme.custom.fontFamilies.monospace,
                },
              ]}
            >
              {Math.round(strength)}%
            </Text> : null}
        </View> : null}

      <View
        style={[
          styles.fullBarContainer,
          { backgroundColor: theme.custom.colors.gray[200] },
        ]}
      >
        <View
          style={[
            styles.fullBar,
            progressBarStyle,
            { backgroundColor: getStrengthColor() },
          ]}
        />
      </View>

      {showLabel ? <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          {config.description}
        </Text> : null}
    </View>
  );
}
