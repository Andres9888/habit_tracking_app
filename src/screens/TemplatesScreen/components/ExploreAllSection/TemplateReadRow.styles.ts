/**
 * Styles for TemplateReadRow — "Habit Browser" card:
 * serif title beside a tinted icon, description, an outlined "Details" pill,
 * a recessed "START SMALL" box, and a bottom rail pairing a meta pill with a
 * circular Add / Added toggle. All colors come from the theme at render time.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  card: {
    ...shadows.card,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: 20,
  },
  // Header: tinted icon square + serif title.
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
  // Outlined "Details ›" pill — self-start so it hugs its content.
  detailsPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailsText: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  // Recessed "START SMALL" box.
  startBox: { borderRadius: 16, marginTop: spacing.md, padding: 14 },
  startLabel: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  startText: { ...typography.body, fontSize: 15, lineHeight: 21, marginTop: 4 },
  // Bottom rail: meta pill + circular Add / Added button pushed right.
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  addSlot: { flexShrink: 0, marginLeft: 'auto' },
  metaPill: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    flexShrink: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metaPillText: { ...typography.bodySmall, fontSize: 14 },
});
