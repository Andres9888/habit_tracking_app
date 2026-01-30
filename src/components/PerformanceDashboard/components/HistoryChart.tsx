/**
 * History Chart Component
 * Bar chart for historical data visualization.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tabStyles } from './tabStyles';

interface HistoryChartProps {
  data: { value: number; maxValue: number }[];
  getBarColor: (value: number) => string;
  label: string;
}

export function HistoryChart({ data, getBarColor, label }: HistoryChartProps) {
  return (
    <View style={tabStyles.history}>
      <Text style={tabStyles.historyLabel}>{label}</Text>
      <View style={tabStyles.historyChart}>
        {data.map((item, i) => (
          <View
            key={i}
            style={[
              tabStyles.historyBar,
              {
                backgroundColor: getBarColor(item.value),
                height: `${Math.min(100, (item.value / item.maxValue) * 100)}%`,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
