/**
 * ScienceBox Component
 *
 * Scientific reference citation box
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';

interface ScienceBoxProps {
  scientificReference: string;
}

export function ScienceBox({ scientificReference }: ScienceBoxProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.scienceBox}>
      <View style={styles.scienceHeader}>
        <Text style={styles.scienceIcon}>🔬</Text>
        <Text style={styles.scienceHeaderText}>Science Behind This Habit</Text>
      </View>
      <Text
        numberOfLines={2}
        style={[theme.custom.typography.caption, styles.scienceText]}
      >
        {scientificReference}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scienceBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    marginTop: 14,
    padding: 12,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  scienceHeaderText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  scienceIcon: {
    fontSize: 14,
  },
  scienceText: {
    color: '#166534',
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
