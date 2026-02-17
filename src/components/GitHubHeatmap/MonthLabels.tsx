/**
 * MonthLabels Component
 *
 * Displays month labels for the heatmap
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { styles, darkStyles } from './GitHubHeatmap.styles';

const CELL_SIZE = 11;
const CELL_GAP = 3;

export interface MonthLabel {
  month: string;
  weekIndex: number;
}

export interface MonthLabelsProps {
  labels: MonthLabel[];
  darkMode?: boolean;
}

export function MonthLabels({ labels, darkMode = false }: MonthLabelsProps) {
  const themeStyles = darkMode ? darkStyles : styles;
  const themeColors = darkMode ? colors.dark : colors;

  const calculatedStyles = StyleSheet.create({
    monthLabelContainer: {
      position: 'absolute',
      bottom: -20,
      left: labels.length > 0 ? labels[0].weekIndex * (CELL_SIZE + CELL_GAP) : 0,
    },
  });

  return (
    <View style={{ position: 'relative' }}>
      {labels.map((label, index) => {
        const leftPosition = label.weekIndex * (CELL_SIZE + CELL_GAP);
        return (
          <Text
            key={`month-label-${index}`}
            style={[
              themeStyles.monthLabel,
              {
                position: 'absolute',
                left: leftPosition,
              },
            ]}
          >
            {label.month}
          </Text>
        );
      })}
    </View>
  );
}
