/**
 * Styles for TemplateReadRow — Version B "confidence-first" card:
 * full-width read, an always-on "Why it works" teaser, a meta-chip row, and
 * a footer that pairs a "How it works" detail affordance with + Add.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  card: { borderRadius: borderRadius.large, overflow: 'hidden' },
  cardWrap: {
    ...shadows.card,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.base,
  },
  chipText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
  },
  description: { ...typography.bodySmall, marginTop: spacing.sm },
  emoji: { fontSize: 22 },
  // Footer: "How it works" detail affordance (left) + Add pill (right).
  footChev: {
    alignItems: 'center',
    borderRadius: 9,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  footCopy: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginRight: spacing.base,
  },
  footTitle: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    paddingBottom: spacing.base,
    paddingTop: spacing.md,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  header: { padding: spacing.base, paddingBottom: 0 },
  name: { ...typography.body, flex: 1, fontWeight: fontWeights.semibold },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Always-on "Why it works" teaser panel.
  teaser: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  teaserLabel: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  teaserText: { ...typography.caption, lineHeight: 19 },
  textMin: { minWidth: 0 },
});
