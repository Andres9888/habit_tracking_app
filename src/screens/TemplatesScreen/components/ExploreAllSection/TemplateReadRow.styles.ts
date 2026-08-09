/**
 * Styles for TemplateReadRow — "Habit Browser" card: serif title beside a
 * tinted icon with a trailing chevron, the habit description, and a bottom
 * rail pairing the meta line with a labeled Add / Added pill. All colors come
 * from the theme at render time.
 *
 * Spacing and type scale are the original card's on purpose — the density win
 * came from removing two whole blocks (the "Start small" box moved to the
 * detail view, the outlined Details pill became the title-row chevron), not
 * from tightening the metrics. Shrinking these as well made the card feel
 * cramped for about 20px of extra gain. Don't re-tighten them.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const TEMPLATE_READ_ROW_PADDING = 20;

export const s = StyleSheet.create({
  card: {
    ...shadows.card,
    borderRadius: 26,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: TEMPLATE_READ_ROW_PADDING,
  },
  cardImporting: { opacity: 0.72 },
  // Science chip: quiet outlined pill under the description — an entry point,
  // not a badge, so it stays in the card's secondary text color.
  scienceChip: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scienceChipText: {
    ...typography.bodySmall,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
  },
  // Header: tinted icon square + serif title + chevron.
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  emoji: { fontSize: 26 },
  name: { ...typography.heading1, flex: 1, fontSize: 21, lineHeight: 26 },
  description: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  // "Details ›" — a label, not a control. See TemplateReadRowHeader for why
  // this is a bare word rather than the pill or the chevron that preceded it.
  detailsLink: {
    ...typography.bodySmall,
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.sm,
  },
  // Bottom rail: plain meta text + labeled Add / Added pill pushed right.
  //
  // The meta used to be a filled pill. In this card a pill means "tappable",
  // so a third, inert pill read as a control that does nothing — and it had to
  // be height-matched against the Add button forever. Plain text says the same
  // thing and stays out of the way.
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  addSlot: { flexShrink: 0, marginLeft: 'auto' },
  metaText: { ...typography.bodySmall, flexShrink: 1, fontSize: 14 },
});
