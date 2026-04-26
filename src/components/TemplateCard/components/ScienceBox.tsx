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
import { typography, fontWeights, fontFamilies} from '../../../theme/typography';

interface ScienceBoxProps {
  scientificReference: string;
}

export function ScienceBox({ scientificReference }: ScienceBoxProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();

  return (
    <View style={[styles.scienceBox, {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[300],
    }]}>
      <View style={styles.scienceHeader}>
        <Text style={styles.scienceIcon}>🔬</Text>
        <Text style={[styles.scienceHeaderText, { color: colors.primary[700] }]}>Science Behind This Habit</Text>
      </View>
      <Text
        numberOfLines={2}
        style={[theme.custom.typography.caption, styles.scienceText, { color: colors.primary[700] }]}
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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
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
