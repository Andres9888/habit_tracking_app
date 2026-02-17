/**
 * EmptyState Component
 *
 * Empty state for StreakTrendsChart
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './StreakTrendsChart.styles';
import { colors } from '../../theme/colors';

export function EmptyState({ darkMode = false }: { darkMode?: boolean }) {
  const themeColors = darkMode ? colors.dark : colors;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 14,
          color: themeColors.text.tertiary,
          textAlign: 'center',
          paddingVertical: 20,
        }}
      >
        No streak data available yet
      </Text>
    </View>
  );
}
