/**
 * Dashboard styles — variation K layout
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const dashboardStyles = StyleSheet.create({
  bannerCard: {
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bannerDate: {
    color: colors.primary[600],
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    marginLeft: 'auto',
  },
  bannerLabel: {
    ...typography.caption,
    color: colors.gray[500],
  },
  card: {
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  container: {
    marginTop: spacing.md,
  },
  heroNumber: {
    color: colors.gray[800],
    fontFamily: fontFamilies.monospace,
    fontSize: 26,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  heroNumberAccent: {
    color: colors.streak[500],
    fontFamily: fontFamilies.monospace,
    fontSize: 26,
    fontWeight: fontWeights.bold,
    marginTop: 2,
  },
  heroNumberDenominator: {
    color: colors.gray[300],
    fontSize: 14,
    fontWeight: fontWeights.regular,
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  heroStatGroup: {
    flex: 1,
    gap: 10,
  },
  heroStatLabel: {
    color: colors.gray[500],
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metricLabel: {
    color: colors.gray[500],
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  metricTile: {
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  metricValue: {
    color: colors.gray[800],
    fontFamily: fontFamilies.monospace,
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  milestoneAway: {
    color: colors.gray[300],
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
  },
  milestoneAwayCurrent: {
    color: colors.streak[500],
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
  },
  milestoneAwayDone: {
    color: colors.primary[600],
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
  },
  milestoneCurrentDot: {
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[500],
    borderRadius: 999,
    borderWidth: 2,
    height: 10,
    width: 10,
  },
  milestoneDoneDot: {
    backgroundColor: colors.primary[600],
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  milestoneFutureDot: {
    backgroundColor: colors.gray[200],
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  milestoneLabel: {
    color: colors.gray[800],
    flex: 1,
    fontSize: 13,
  },
  milestoneLabelCurrent: {
    color: colors.streak[500],
    flex: 1,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
  },
  milestoneLabelDone: {
    color: colors.primary[600],
    flex: 1,
    fontSize: 13,
  },
  milestoneLabelFuture: {
    color: colors.gray[300],
    flex: 1,
    fontSize: 13,
  },
  milestoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  milestonesCard: {
    backgroundColor: colors.light.surface,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    gap: 10,
    marginBottom: spacing.md,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ringWrap: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  ringText: {
    color: colors.gray[800],
    fontFamily: fontFamilies.monospace,
    fontSize: 24,
    fontWeight: fontWeights.bold,
    position: 'absolute',
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.gray[500],
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
});
