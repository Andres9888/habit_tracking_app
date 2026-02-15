/**
 * ExportButton - Button to trigger data export
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface ExportButtonProps {
  onPress: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onPress }) => {
  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Double tap to export your habit data as CSV or JSON'
      accessibilityLabel='Export Data'
      accessibilityRole='button'
      style={styles.exportButton}
      onPress={onPress}
    >
      <Ionicons color={colors.surface} name='download-outline' size={20} />
      <Text style={styles.exportButtonText}>Export Data</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  exportButtonText: {
    ...typography.button,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
});
