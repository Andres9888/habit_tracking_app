/**
 * ExportButton - Button to trigger data export
 * OPTIMIZED: Uses useThemeColors() for dark mode support
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';

interface ExportButtonProps {
  onPress: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onPress }) => {
  const { colors } = useThemeColors();
  
  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Double tap to export your habit data as CSV or JSON'
      accessibilityLabel='Export Data'
      accessibilityRole='button'
      style={[styles.exportButton, { backgroundColor: colors.primary[500] }]}
      onPress={onPress}
    >
      <Ionicons color={colors.surface} name='download-outline' size={20} />
      <Text style={[styles.exportButtonText, { color: colors.surface }]}>Export Data</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    alignItems: 'center',
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  exportButtonText: {
    ...typography.button,
    marginLeft: spacing.sm,
  },
});
