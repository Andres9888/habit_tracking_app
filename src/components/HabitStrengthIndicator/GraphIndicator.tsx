/**
 * Graph Variant (trend line for premium analytics)
 * Placeholder for future implementation
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../theme';
import { styles } from './styles';

export function GraphIndicator() {
  const theme = useAppTheme();

  // TODO: Implement graph variant with Victory Native or react-native-svg
  // This will be implemented in Phase 7: Premium Features
  return (
    <View style={styles.graphContainer}>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        Graph variant - Coming soon (Premium feature)
      </Text>
    </View>
  );
}
