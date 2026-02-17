import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../../theme/darkColors';

/**
 * Theme-aware progress styles factory.
 * Call getProgressStyles(colors) in your component after useThemeColors().
 */
export const getProgressStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    badgeIcon: {
      fontSize: 17,
      marginLeft: 4,
    },
    container: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      marginTop: 12,
      padding: 12,
    },
    daysAway: {
      color: colors.text.secondary,
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
      color: colors.text.primary,
      fontSize: 15,
      fontWeight: '600',
    },
    milestoneName: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginBottom: 12,
    },
    progressBadge: {
      alignItems: 'center',
      backgroundColor: '#fef3c7', // amber-100 — intentional celebration color
      borderColor: '#fbbf24',     // amber-400
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
      backgroundColor: '#f59e0b', // amber-500 — milestone progress bar
      borderRadius: borderRadius.xs,
      height: '100%',
    },
    progressBarTrack: {
      backgroundColor: colors.gray[200],
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
      color: colors.text.secondary,
      fontSize: typography.tabBar.fontSize,
    },
    // NoStreak state styles
    noStreakContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 4,
    },
    noStreakIcon: {
      marginRight: 12,
    },
    noStreakSubtext: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      marginTop: 2,
    },
    noStreakTextContainer: {
      flex: 1,
    },
    noStreakTitle: {
      color: colors.text.primary,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: '600',
    },
  });

/**
 * @deprecated Use getProgressStyles(colors) from useThemeColors() instead.
 * Kept for backward compat with existing static imports.
 */
export const progressStyles = StyleSheet.create({
  badgeIcon: {
    fontSize: 17,
    marginLeft: 4,
  },
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  daysAway: {
    color: '#6b7280',
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
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '600',
  },
  milestoneName: {
    color: '#78716c',
    fontSize: typography.caption.fontSize,
    marginBottom: 12,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
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
    backgroundColor: '#f59e0b',
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: '#e5e7eb',
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
    color: '#78716c',
    fontSize: typography.tabBar.fontSize,
  },
});
