/**
 * EmptyState Component
 *
 * Empty state for the GitHubHeatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles, darkStyles } from './GitHubHeatmap.styles';
import { colors } from '../../theme/colors';

export function EmptyState({ darkMode = false }: { darkMode?: boolean }) {
  const themeStyles = darkMode ? darkStyles : styles;
  const themeColors = darkMode ? colors.dark : colors;

  return (
    <View style={themeStyles.container}>
      <Text
        style={{
          fontSize: 14,
          color: themeColors.text.tertiary,
          textAlign: 'center',
          paddingVertical: 20,
        }}
      >
        No data available yet
      </Text>
    </View>
  );
}
