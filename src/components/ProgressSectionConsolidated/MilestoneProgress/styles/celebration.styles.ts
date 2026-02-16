import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../../theme/darkColors';

export const celebrationStyles = StyleSheet.create({
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: '#fefce8', // amber-50
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
    color: '#92400e', // amber-800
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: '#78350f', // amber-900
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextMilestoneText: {
    color: '#92400e', // amber-800
    fontSize: typography.caption.fontSize,
    marginTop: 8,
  },
});

export function themedCelebrationStyles(colors: SemanticColors) {
  return StyleSheet.create({
    celebrationContainer: {
      borderColor: colors.borders.warning,
    },
  });
}
