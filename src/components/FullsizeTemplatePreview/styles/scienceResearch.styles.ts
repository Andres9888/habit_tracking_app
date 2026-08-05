/**
 * Science drill-down — block styles: "How it becomes automatic" strength
 * explainer and "The research" sources list.
 *
 * Layout only — colors come from `useScienceCard()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceResearchStyles = StyleSheet.create({
  // Strength explainer
  strIntro: {
    ...typography.bodySmall,
    lineHeight: 21,
    marginBottom: spacing.base,
  },
  strTrack: { alignItems: 'flex-start', flexDirection: 'row' },
  strConnector: {
    borderRadius: 1,
    flex: 1,
    height: 2,
    marginTop: 17,
    opacity: 0.45,
  },
  strNode: { alignItems: 'center', width: 46 },
  strCircle: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  strEmoji: { fontSize: 16 },
  strLabel: {
    fontSize: 9,
    fontWeight: fontWeights.semibold,
    lineHeight: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  // Sources
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
    ...typography.caption,
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
});
