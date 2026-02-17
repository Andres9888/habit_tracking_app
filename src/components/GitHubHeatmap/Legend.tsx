/**
 * Legend Component
 *
 * Displays the legend for the heatmap
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { LegendProps } from './GitHubHeatmap.types';
import { styles, darkStyles } from './GitHubHeatmap.styles';

const LEVELS = [
  { level: 'none', label: 'Less' },
  { level: 'low', label: '' },
  { level: 'medium', label: '' },
  { level: 'high', label: '' },
] as const;

export function Legend({ darkMode = false }: LegendProps) {
  const themeStyles = darkMode ? darkStyles : styles;
  const themeColors = darkMode ? colors.dark : colors;

  const getColor = (level: string) => {
    switch (level) {
      case 'high':
        return themeColors.primary[500];
      case 'medium':
        return darkMode ? '#006d32' : '#9be9a8';
      case 'low':
        return darkMode ? '#004d26' : '#40c463';
      case 'none':
      default:
        return darkMode ? '#0d1117' : '#ebedf0';
    }
  };

  return (
    <View style={themeStyles.legendContainer}>
      <Text style={themeStyles.legendLabel}>Less</Text>
      {LEVELS.map((item) => (
        <View
          key={`legend-${item.level}`}
          style={[
            themeStyles.legendItem,
            { backgroundColor: getColor(item.level) },
          ]}
        />
      ))}
      <Text style={themeStyles.legendLabel}>More</Text>
    </View>
  );
}
