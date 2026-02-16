/**
 * Section card styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { SemanticColors } from '../../../theme/darkColors';

export const sectionStyles = StyleSheet.create({
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sectionIconBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sectionIconEmoji: {
    fontSize: 17,
  },
});

export function themedSectionStyles(colors: SemanticColors) {
  return StyleSheet.create({
    descriptionText: {
      color: colors.text.secondary,
      fontSize: typography.body.fontSize,
      lineHeight: 26,
    },
    sectionCard: {
      ...shadows.card,
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 16,
      marginHorizontal: 20,
      padding: 20,
      shadowOpacity: 0.04,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
  });
}
