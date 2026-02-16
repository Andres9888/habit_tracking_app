/**
 * ScienceBox Component
 *
 * Scientific reference citation box
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface ScienceBoxProps {
  scientificReference: string;
}

export function ScienceBox({ scientificReference }: ScienceBoxProps) {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();

  return (
    <View style={[styles.scienceBox, {
      backgroundColor: isDark ? colors.primary[100] : '#f0fdf4',
      borderColor: isDark ? colors.primary[300] : colors.borders.success,
    }]}>
      <View style={styles.scienceHeader}>
        <Text style={styles.scienceIcon}>🔬</Text>
        <Text style={[styles.scienceHeaderText, { color: isDark ? colors.primary[400] : '#166534' }]}>Science Behind This Habit</Text>
      </View>
      <Text
        numberOfLines={2}
        style={[theme.custom.typography.caption, styles.scienceText, { color: isDark ? colors.primary[500] : '#166534' }]}
      >
        {scientificReference}
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  scienceBox: {
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
    fontSize: 13,
    fontWeight: '600',
  },
  scienceIcon: {
    fontSize: typography.bodySmall.fontSize,
  },
  scienceText: {
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
