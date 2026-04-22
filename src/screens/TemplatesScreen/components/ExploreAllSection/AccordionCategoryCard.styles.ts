/**
 * Styles for AccordionCategoryCard.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  body: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.xs,
  },
  card: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  showAll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  showAllText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
});

export function getCardColors(
  expanded: boolean,
  cardColor: string,
  borderColor: string,
  isDark: boolean
) {
  if (!expanded) return { backgroundColor: cardColor, borderColor };
  return {
    backgroundColor: isDark ? 'rgba(5,150,105,0.08)' : '#FFFBF4',
    borderColor: isDark ? 'rgba(5,150,105,0.25)' : '#E5DED2',
  };
}
