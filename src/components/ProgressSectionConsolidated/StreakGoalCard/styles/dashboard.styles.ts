/**
 * Dashboard styles — theme-aware via createDashboardStyles(colors).
 */

import { StyleSheet } from 'react-native';

import { colors as staticColors } from '@/theme';
import type { SemanticColors } from '@/theme/darkColors';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export function createDashboardStyles(colors: SemanticColors) {
  return StyleSheet.create({
    bannerCard: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    bannerDate: {
      color: staticColors.primary[600],
      fontFamily: fontFamilies.monospace,
      fontSize: 13,
      fontWeight: fontWeights.semibold,
      marginLeft: 'auto',
    },
    bannerLabel: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      marginBottom: spacing.md,
      padding: spacing.lg,
    },
    container: {
      marginTop: spacing.md,
    },
    heroNumber: {
      color: colors.text.primary,
      fontFamily: fontFamilies.monospace,
      fontSize: 26,
      fontWeight: fontWeights.bold,
      marginTop: 2,
    },
    heroNumberAccent: {
      color: staticColors.streak[500],
      fontFamily: fontFamilies.monospace,
      fontSize: 26,
      fontWeight: fontWeights.bold,
      marginTop: 2,
    },
    heroNumberDenominator: {
      color: colors.text.tertiary,
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
      color: colors.text.secondary,
      fontSize: 12,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    metricLabel: {
      color: colors.text.secondary,
      fontSize: 11,
      marginTop: 4,
      textAlign: 'center',
    },
    metricTile: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 14,
    },
    metricValue: {
      color: colors.text.primary,
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
      color: colors.text.tertiary,
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneAwayCurrent: {
      color: staticColors.streak[500],
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneAwayDone: {
      color: staticColors.primary[600],
      fontFamily: fontFamilies.monospace,
      fontSize: 12,
    },
    milestoneCurrentDot: {
      backgroundColor: staticColors.streak[100],
      borderColor: staticColors.streak[500],
      borderRadius: borderRadius.full,
      borderWidth: 2,
      height: 10,
      width: 10,
    },
    milestoneDoneDot: {
      backgroundColor: staticColors.primary[600],
      borderRadius: borderRadius.full,
      height: 8,
      width: 8,
    },
    milestoneFutureDot: {
      backgroundColor: colors.border,
      borderRadius: borderRadius.full,
      height: 8,
      width: 8,
    },
    milestoneLabel: {
      color: colors.text.primary,
      flex: 1,
      fontSize: 13,
    },
    milestoneLabelCurrent: {
      color: staticColors.streak[500],
      flex: 1,
      fontSize: 13,
      fontWeight: fontWeights.semibold,
    },
    milestoneLabelDone: {
      color: staticColors.primary[600],
      flex: 1,
      fontSize: 13,
    },
    milestoneLabelFuture: {
      color: colors.text.tertiary,
      flex: 1,
      fontSize: 13,
    },
    milestoneRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    milestonesCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      gap: 10,
      borderWidth: 1,
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
      color: colors.text.primary,
      fontFamily: fontFamilies.monospace,
      fontSize: 24,
      fontWeight: fontWeights.bold,
      position: 'absolute',
    },
    sectionLabel: {
      ...typography.caption,
      color: colors.text.secondary,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.6,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
  });
}

export type DashboardStyles = ReturnType<typeof createDashboardStyles>;
