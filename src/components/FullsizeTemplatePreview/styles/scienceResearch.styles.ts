/**
 * Science drill-down — "The research" sources list styles.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceResearchStyles = StyleSheet.create({
  // Sources
  sourceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
  },
  sourceNum: {
    color: colors.gray[300],
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  sourceTitle: {
    color: colors.gray[800],
    ...typography.bodySmall,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
  },
  sourceMeta: { color: colors.gray[500], ...typography.caption, marginTop: 2 },
  sourceJournal: { fontStyle: 'italic' },
  disclaimer: {
    color: colors.gray[400],
    ...typography.caption,
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
});
