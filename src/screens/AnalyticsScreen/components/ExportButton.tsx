/**
 * ExportButton - Button to trigger data export
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Download } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
import { iconSizes } from '@/theme/iconSizes';

interface ExportButtonProps {
  onPress: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onPress }) => {
  return (
    <AnimatedPressable
      accessible
      // Primary CTA; nothing downstream fires a haptic.
      animationConfig={{ enableHaptics: true }}
      accessibilityHint='Double tap to export your habit data as CSV or JSON'
      accessibilityLabel='Export Data'
      accessibilityRole='button'
      style={styles.exportButton}
      onPress={onPress}
    >
      <Download color={colors.surface} size={iconSizes.medium} />
      <Text style={styles.exportButtonText}>Export Data</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.button,
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
