import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';

export const s = StyleSheet.create({
  count: { ...typography.caption, fontWeight: fontWeights.medium },
  header: { paddingHorizontal: spacing.base, paddingTop: spacing.xs },
  list: { gap: spacing.sm, paddingBottom: spacing.lg, paddingHorizontal: spacing.base },
  listHeaderRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.base,
  },
  overline: {
    ...typography.overline,
    fontWeight: fontWeights.bold,
  },
  searchWrap: { paddingHorizontal: spacing.base, paddingTop: spacing.sm },
  title: {
    ...typography.heading1,
    fontFamily: fontFamilies.primary.display,
    // "Two Worlds" mock hero: serif 25 / 600 / -0.4 (larger + lighter than H1).
    fontSize: 25,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.4,
    lineHeight: 31,
  },
});
