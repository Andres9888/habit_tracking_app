/**
 * Styles for TemplateReadRow
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../../theme/typography';

export const s = StyleSheet.create({
  addSlot: { alignSelf: 'flex-start', flexShrink: 0 },
  // Boxed card — no border, subtle lift, matches the pre-merge catalog card.
  card: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
  },
  // Flat card — the reference design has no border or shadow, the
  // #EDEAE5 surface alone separates it from the parchment background.
  cardWrap: {
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  description: { ...typography.caption, lineHeight: 19, marginTop: spacing.xs },
  detailsLink: { alignSelf: 'flex-end', marginTop: spacing.sm },
  detailsLinkLabel: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  drawerBody: {
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
  },
  drawerCitation: {
    fontFamily: fontFamilies.monospace,
    fontSize: 10.5,
    letterSpacing: 0.2,
    marginTop: spacing.md,
  },
  drawerEvidence: {
    ...typography.caption,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  // The curated "why it works" paragraph — editorial serif read.
  drawerLead: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 15,
    lineHeight: 23,
  },
  drawerStartSmall: {
    ...typography.caption,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  drawerStartSmallPrefix: { fontWeight: fontWeights.bold },
  emoji: { fontSize: 20 },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
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
  info: { flex: 1, gap: spacing.xs, minWidth: 0 },
  metaPill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  metaPillText: { ...typography.caption, fontWeight: fontWeights.semibold },
  name: { ...typography.body, fontWeight: fontWeights.semibold },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.base,
    paddingBottom: 0,
  },
  toggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toggleLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
