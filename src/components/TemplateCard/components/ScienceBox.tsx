/**
 * ScienceBox Component
 *
 * Scientific reference citation box
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
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

export const styles = StyleSheet.create({
  scienceBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: borderRadius.medium,
    borderWidth: 2,
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  scienceHeaderText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  scienceIcon: {
    fontSize: typography.bodySmall.fontSize,
  },
  scienceText: {
    color: '#166534',
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
