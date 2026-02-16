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

export function themedCardStyles(colors: SemanticColors) {
  return StyleSheet.create({
    cardGradient: {
      borderColor: colors.borders.successCard,
    },
  });
}
