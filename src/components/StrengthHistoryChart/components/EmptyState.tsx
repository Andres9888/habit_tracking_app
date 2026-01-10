import React from 'react';
import { View, Text } from 'react-native';

import { useAppTheme } from '../../../theme';
import { styles } from '../StrengthHistoryChart.styles';

interface EmptyStateProps {
  height: number;
}

export function EmptyState({ height }: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.emptyContainer,
        {
          backgroundColor: theme.custom.colors.gray[50],
          borderRadius: theme.custom.borderRadius.medium,
          height,
        },
      ]}
    >
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        Not enough data yet
      </Text>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[400], marginTop: 4 },
        ]}
      >
        Keep tracking to see your progress
      </Text>
    </View>
  );
}
