/**
 * Dashboard styles — theme-aware via createDashboardStyles(colors).
 */

import { StyleSheet } from 'react-native';

import { colors as staticColors } from '@/theme';
import type { SemanticColors } from '@/theme/darkColors';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';
import { createDashboardMilestoneStyles } from './dashboardMilestone.styles';
import { createDashboardMetricStyles } from './dashboardMetrics.styles';

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
      fontSize: 11,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    ...createDashboardMetricStyles(colors),
    ...createDashboardMilestoneStyles(colors),
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
