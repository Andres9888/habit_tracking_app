/**
 * DayLabels Component
 *
 * Displays day of week labels for the heatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles, darkStyles } from './GitHubHeatmap.styles';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function DayLabels({ darkMode = false }: { darkMode?: boolean }) {
  const themeStyles = darkMode ? darkStyles : styles;

  return (
    <View style={themeStyles.weekColumn}>
      {DAY_LABELS.map((label, index) => (
        <Text key={`day-label-${index}`} style={themeStyles.dayLabel}>
          {label}
        </Text>
      ))}
    </View>
  );
}
