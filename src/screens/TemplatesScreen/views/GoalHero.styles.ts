/**
 * Styles for GoalHero.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  backBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backLabel: { ...typography.body, fontWeight: fontWeights.semibold },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  content: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  countBadge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  countText: { ...typography.caption, fontWeight: fontWeights.semibold },
  hero: {
    borderBottomWidth: 1,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  iconText: { fontSize: 26 },
  iconWrap: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  pathNote: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  pathNoteText: { ...typography.caption, fontWeight: fontWeights.semibold },
  subtitle: { ...typography.bodySmall, marginTop: 2 },
  textBlock: { flex: 1 },
  title: { ...typography.heading2, letterSpacing: -0.4 },
});
