/**
 * Science drill-down — block styles: "How it becomes automatic" strength
 * explainer and "The research" sources list.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceResearchStyles = StyleSheet.create({
  // Strength explainer
  strIntro: {
    color: colors.gray[700],
    ...typography.bodySmall,
    lineHeight: 21,
    marginBottom: spacing.base,
  },
  strTrack: { alignItems: 'flex-start', flexDirection: 'row' },
  strConnector: { backgroundColor: colors.border, borderRadius: 1, flex: 1, height: 2, marginTop: 17 },
  strNode: { alignItems: 'center', width: 46 },
  strCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  strNum: {
    color: colors.gray[500],
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  strNumFilled: { color: '#FFFFFF' },
  strLabel: {
    color: colors.gray[500],
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
