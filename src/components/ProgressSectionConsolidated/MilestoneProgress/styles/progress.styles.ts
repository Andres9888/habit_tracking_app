import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../../../theme/darkColors';

export const createProgressStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    badgeIcon: {
      fontSize: 17,
      marginLeft: 4,
    },
    container: {
      backgroundColor: tc.milestoneBg,
      borderColor: tc.milestoneBorder, // gray-200
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      marginTop: 12,
      padding: 12,
    },
    daysAway: {
      color: tc.milestoneText, // gray-500
      fontSize: 13,
      fontWeight: '500',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    headerLeft: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerTitle: {
      color: tc.text.primary, // gray-800
      fontSize: 15,
      fontWeight: '600',
    },
    milestoneName: {
      color: tc.milestoneSecondary, // gray-500 (WCAG AA compliant)
      fontSize: typography.caption.fontSize,
      marginBottom: 12,
    },
    progressBadge: {
      alignItems: 'center',
      backgroundColor: tc.milestoneCelebrationBg, // amber-100
      borderColor: tc.milestoneCelebrationBorder, // amber-400
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      height: 24,
      justifyContent: 'center',
      marginLeft: 8,
      width: 24,
    },
    progressBadgeText: {
      fontSize: typography.caption.fontSize,
    },
    progressBarContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    progressBarFill: {
      backgroundColor: tc.milestoneProgressFill, // amber-500
      borderRadius: borderRadius.xs,
      height: '100%',
    },
    progressBarTrack: {
      backgroundColor: tc.milestoneTrackBg, // gray-200
      borderRadius: borderRadius.xs,
      flex: 1,
      height: 8,
      overflow: 'hidden',
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    progressLabelText: {
      color: tc.milestoneSecondary, // gray-500 (WCAG AA compliant)
      fontSize: typography.tabBar.fontSize,
    },
  });

/** @deprecated Light mode defaults - use createProgressStyles(themeColors) */
export const progressStyles = createProgressStyles({
  milestoneBg: '#ffffff',
  milestoneBorder: '#e5e7eb',
  milestoneText: '#6b7280',
  milestoneSecondary: '#78716c',
  milestoneCelebrationBg: '#fef3c7',
  milestoneCelebrationBorder: '#fbbf24',
  milestoneProgressFill: '#f59e0b',
  milestoneTrackBg: '#e5e7eb',
  text: { primary: '#1f2937' } as any,
} as any);
