
import React from 'react';
import { View, Text } from 'react-native';

import type { TrendDirection } from '../StrengthHistoryChart.types';
import { styles } from '../StrengthHistoryChart.styles';
import { useAppTheme } from '../../../theme';

interface StatsRowProps {
  latestStrength: number;
  strengthChange: number;
  trend: TrendDirection;
  dataLength: number;
}

export function StatsRow({
  latestStrength,
  strengthChange,
  trend,
  dataLength,
}: StatsRowProps) {
  const theme = useAppTheme();

  const changeColor =
    trend === 'up'
      ? theme.custom.colors.success[600]
      : trend === 'down'
        ? theme.custom.colors.error[600]
        : theme.custom.colors.gray[600];

  return (
    <View style={styles.statsRow}>
      <View>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[600] },
          ]}
        >
          Current
        </Text>
        <Text
          style={[
            theme.custom.typography.heading3,
            { color: theme.custom.colors.gray[900] },
          ]}
        >
          {latestStrength.toFixed(0)}%
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[600] },
          ]}
        >
          {dataLength}-Day Change
        </Text>
        <Text
          style={[theme.custom.typography.heading3, { color: changeColor }]}
        >
          {strengthChange > 0 ? '+' : ''}
          {strengthChange.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
}
