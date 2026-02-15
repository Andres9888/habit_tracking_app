/**
 * ExportButton - Button to trigger data export
 * Theme-aware with dark mode support
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';

interface ExportButtonProps {
  onPress: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onPress }) => {
  const { colors: tc, isDark } = useThemeColors();

  return (
    <AnimatedPressable
      accessible
      accessibilityHint='Double tap to export your habit data as CSV or JSON'
      accessibilityLabel='Export Data'
      accessibilityRole='button'
      style={[
        styles.exportButton,
        {
          backgroundColor: isDark ? tc.primary[500] : tc.primary[600],
        },
      ]}
      onPress={onPress}
    >
      <Ionicons color='#FFFFFF' name='download-outline' size={20} />
      <Text style={styles.exportButtonText}>Export Data</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: 14,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    marginLeft: spacing.sm,
  },
});
