/**
 * Styles for TemplateReadRow — full-width habit card: icon + serif name, a
 * description with inline "Details ›" affordance, a "Start small" teaser, and a
 * foot row pairing the duration pill with the + Add button.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';

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
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  chipText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
  },
  description: { ...typography.bodySmall, marginTop: spacing.sm },
  // Inline "Details ›" affordance under the description.
  details: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 2,
    marginTop: spacing.sm,
  },
  detailsText: { ...typography.caption, fontWeight: fontWeights.semibold },
  emoji: { fontSize: 22 },
  // Foot row: duration pill (left) + Add pill (right).
  foot: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
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
  name: {
    ...typography.heading3,
    flex: 1,
    fontFamily: fontFamilies.primary.display,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.36,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Always-on "Why it works" / "Start small" teaser panel.
  teaser: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  teaserLabel: {
    fontFamily: fontFamilies.monospace,
    fontSize: 10,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  teaserText: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  },
});
