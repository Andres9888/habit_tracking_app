/**
 * ExportButton - Button to trigger data export
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface ExportButtonProps {
  onPress: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      accessible
      accessibilityHint='Double tap to export your habit data as CSV or JSON'
      accessibilityLabel='Export Data'
      accessibilityRole='button'
      activeOpacity={0.8}
      style={styles.exportButton}
      onPress={onPress}
    >
      <Ionicons color={colors.surface} name='download-outline' size={20} />
      <Text style={styles.exportButtonText}>Export Data</Text>
    </TouchableOpacity>
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
