/**
 * ChartLegend - Displays chart legend items
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export function ChartLegend() {
  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View
          style={[styles.legendLine, { backgroundColor: colors.primary[500] }]}
        />
        <Text style={styles.legendText}>Average Habit Strength</Text>
      </View>
    </View>
  );
}
