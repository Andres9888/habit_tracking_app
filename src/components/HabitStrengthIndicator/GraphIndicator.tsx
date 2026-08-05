/**
 * Graph Variant (trend line for premium analytics)
 * Informational fallback shown when chart data is unavailable.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../theme';
import { styles } from './styles';

export function GraphIndicator() {
  const theme = useAppTheme();

  return (
    <View style={styles.graphContainer}>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        Detailed trend charts are available with premium insights.
      </Text>
    </View>
  );
}
