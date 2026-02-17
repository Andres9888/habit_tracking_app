/**
 * WeeklySummaryStrip - Card Container Styles
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';
import type { SemanticColors } from '../../../theme/darkColors';

export const cardStyles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowOpacity: 0.08,
  },
  cardGradient: {
    borderColor: '#a7f3d0', // emerald-200
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  container: {
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
});

/** Theme-aware overrides */
export function themedCardStyles(colors: SemanticColors) {
  return {
    card: { backgroundColor: colors.card },
    cardGradient: { borderColor: colors.primary[300] },
  } as const;
}
