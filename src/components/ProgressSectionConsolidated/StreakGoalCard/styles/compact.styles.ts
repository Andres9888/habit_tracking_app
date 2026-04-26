/* eslint-disable max-lines -- StyleSheet.create data file */
/**
 * Compact layout styles — smaller ring, inline metrics, collapsed milestones.
 */
import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const compactStyles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    flexShrink: 0,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  badgeCurrent: {
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[500],
    borderWidth: 1.5,
  },
  badgeDone: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[600],
  },
  badgeFuture: {
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.gray[200],
    opacity: 0.5,
  },
  badgeGoal: {
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[500],
    borderWidth: 1.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeText: { fontSize: 14 },
  heroCard: {
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginBottom: 10,
    padding: 16,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  heroMetaText: {
    color: colors.gray[500],
    fontSize: typography.tabBar.fontSize,
  },
  heroProgressBar: {
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.xs,
    height: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  heroProgressFill: {
    backgroundColor: colors.streak[500],
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  heroRemaining: {
    color: colors.streak[500],
    fontSize: 11,
    fontWeight: fontWeights.semibold,
  },
  heroRight: { flex: 1 },
  heroRow: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  heroStat: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStatDenom: {
    color: colors.gray[300],
    fontSize: 12,
    fontWeight: fontWeights.regular,
  },
  heroStatValue: {
    color: colors.gray[800],
    fontFamily: fontFamilies.monospace,
    fontSize: typography.heading3.fontSize,
    fontWeight: fontWeights.bold,
  },
  milestonesCard: {
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  milestonesLabel: {
    ...typography.caption,
    color: colors.gray[500],
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  nextBadge: { fontSize: 24 },
  nextCard: {
    alignItems: 'center',
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[300],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  nextDays: {
    color: colors.streak[500],
    fontFamily: fontFamilies.monospace,
    fontSize: typography.heading3.fontSize,
    fontWeight: fontWeights.bold,
  },
  nextDaysLabel: {
    color: colors.streak[500],
    fontSize: 9,
    textAlign: 'right',
  },
  nextLabel: {
    color: colors.streak[500],
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  nextName: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.display,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  nextTextGroup: { flex: 1 },
  ringSmallText: {
    color: colors.gray[800],
    fontFamily: fontFamilies.monospace,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    position: 'absolute',
  },
  ringSmallWrap: {
    alignItems: 'center',
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
});
