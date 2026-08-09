/**
 * Science drill-down — "The research" sources list styles.
 *
 * Layout only — colors come from `useScienceCard()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceResearchStyles = StyleSheet.create({
  sourceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
  },
  sourceNum: {
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  sourceTitle: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
    lineHeight: 19,
  },
  sourceMeta: { ...typography.caption, marginTop: 2 },
  sourceJournal: { fontStyle: 'italic' },
  disclaimer: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
  },
});
