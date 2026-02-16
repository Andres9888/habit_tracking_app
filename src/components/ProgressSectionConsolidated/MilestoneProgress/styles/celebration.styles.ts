import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '@/theme/darkColors';

export function getCelebrationStyles(colors: SemanticColors) {
  return StyleSheet.create({
    celebrationContainer: {
      alignItems: 'center',
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[300],
      borderWidth: 1,
    },
    celebrationContent: {
      alignItems: 'center',
      padding: 8,
    },
    celebrationEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    celebrationSubtext: {
      color: colors.primary[600],
      fontSize: 13,
      fontWeight: '500',
    },
    celebrationTitle: {
      color: colors.primary[700],
      fontSize: typography.body.fontSize,
      fontWeight: '700',
      marginBottom: 2,
    },
    nextMilestoneText: {
      color: colors.primary[600],
      fontSize: typography.caption.fontSize,
      marginTop: 8,
    },
  });
}
