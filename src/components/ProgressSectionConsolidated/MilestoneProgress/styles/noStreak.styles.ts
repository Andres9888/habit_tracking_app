import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '@/theme/darkColors';

export function getNoStreakStyles(colors: SemanticColors) {
  return StyleSheet.create({
    noStreakContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 4,
    },
    noStreakIcon: {
      marginRight: 12,
    },
    noStreakSubtext: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginTop: 2,
    },
    noStreakTextContainer: {
      flex: 1,
    },
    noStreakTitle: {
      color: colors.text.primary,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: '600',
    },
  });
}
