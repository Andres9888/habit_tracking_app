/* eslint-disable max-lines -- StyleSheet factory for theme-aware compact layout */
/**
 * Compact layout styles — theme-aware via createCompactStyles(colors).
 * Streak/primary accents stay static (intentional brand colors).
 */
import { StyleSheet } from 'react-native';
import { colors as staticColors } from '@/theme';
import { borderRadius } from '@/theme/spacing';
import type { SemanticColors } from '@/theme/darkColors';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export function createCompactStyles(colors: SemanticColors) {
  return StyleSheet.create({
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
      backgroundColor: staticColors.streak[100],
      borderColor: staticColors.streak[500],
      borderWidth: 1.5,
    },
    badgeDone: {
      backgroundColor: staticColors.primary[100],
      borderColor: staticColors.primary[600],
    },
    badgeFuture: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      opacity: 0.5,
    },
    badgeGoal: {
      backgroundColor: staticColors.streak[100],
      borderColor: staticColors.streak[500],
      borderWidth: 1.5,
    },
    badgeRow: {
      flexDirection: 'row',
      gap: 6,
    },
    badgeText: { fontSize: typography.bodySmall.fontSize },
    heroCard: {
      marginBottom: 14,
    },
    heroMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    heroMetaText: {
      color: colors.text.secondary,
      fontSize: typography.tabBar.fontSize,
    },
    heroProgressBar: {
      backgroundColor: colors.border,
      borderRadius: borderRadius.xs,
      height: 4,
      marginTop: 8,
      overflow: 'hidden',
    },
    heroProgressFill: {
      backgroundColor: staticColors.streak[500],
      borderRadius: borderRadius.xs,
      height: '100%',
    },
    heroRemaining: {
      color: staticColors.streak[500],
      fontSize: typography.overline.fontSize,
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
      color: colors.text.tertiary,
      fontSize: typography.overline.fontSize,
      fontWeight: fontWeights.regular,
    },
    heroStatValue: {
      color: colors.text.primary,
      fontFamily: fontFamilies.monospace,
      fontSize: typography.heading3.fontSize,
      fontWeight: fontWeights.bold,
    },
    milestonesCard: {
      marginBottom: 14,
    },
    milestonesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    milestonesLabel: {
      ...typography.caption,
      color: colors.text.secondary,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    nextBadge: { fontSize: 24 },
    nextCard: {
      alignItems: 'center',
      backgroundColor: staticColors.streak[100],
      borderColor: staticColors.streak[300],
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 12,
      marginBottom: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    nextDays: {
      color: staticColors.streak[500],
      fontFamily: fontFamilies.monospace,
      fontSize: typography.heading3.fontSize,
      fontWeight: fontWeights.bold,
    },
    nextDaysLabel: {
      color: staticColors.streak[500],
      fontSize: typography.tabBar.fontSize,
      textAlign: 'right',
    },
    nextLabel: {
      color: staticColors.streak[500],
      fontSize: typography.overline.fontSize,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    nextName: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.display,
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.bold,
      marginTop: 2,
    },
    nextTextGroup: { flex: 1 },
    ringSmallText: {
      color: colors.text.primary,
      fontFamily: fontFamilies.monospace,
      fontSize: typography.monospace.fontSize,
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
}

export type CompactStyles = ReturnType<typeof createCompactStyles>;
