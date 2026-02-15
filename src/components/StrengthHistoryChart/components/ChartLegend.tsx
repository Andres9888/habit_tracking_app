
import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../StrengthHistoryChart.styles';
import { useAppTheme } from '../../../theme';

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: color }]} />
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[600] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function ChartLegend() {
  const theme = useAppTheme();

  return (
    <View style={styles.legend}>
      <LegendItem color={theme.custom.colors.primary[500]} label='Strength' />
      <LegendItem color={theme.custom.colors.secondary[500]} label='Baseline' />
      <LegendItem color={theme.custom.colors.warning[500]} label='Compliance' />
    </View>
  );
}
