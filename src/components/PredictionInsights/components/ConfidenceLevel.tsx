import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../PredictionInsights.styles';
import type { AppTheme } from '../../../theme';

interface ConfidenceLevelProps {
  confidence: number;
  theme: AppTheme;
}

export function ConfidenceLevel({ confidence, theme }: ConfidenceLevelProps) {
  return (
    <View style={styles.confidenceContainer}>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[600] },
        ]}
      >
        Confidence Level
      </Text>
      <View
        style={[
          styles.confidenceBar,
          {
            backgroundColor: theme.custom.colors.gray[200],
            borderRadius: theme.custom.borderRadius.small,
          },
        ]}
      >
        <View
          style={[
            styles.confidenceFill,
            {
              backgroundColor: theme.custom.colors.primary[500],
              borderRadius: theme.custom.borderRadius.small,
              width: `${confidence}%`,
            },
          ]}
        />
      </View>
      <Text
        style={[
          theme.custom.typography.caption,
          {
            color: theme.custom.colors.gray[700],
            fontFamily: theme.custom.fontFamilies.monospace,
          },
        ]}
      >
        {confidence.toFixed(0)}%
      </Text>
    </View>
  );
}
