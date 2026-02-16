import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../../theme/darkColors';

export const progressStyles = StyleSheet.create({
  badgeIcon: {
    fontSize: 17,
    marginLeft: 4,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  daysAway: {
    color: '#6b7280', // gray-500
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
    color: '#1f2937', // gray-800
    fontSize: 15,
    fontWeight: '600',
  },
  milestoneName: {
    color: '#78716c', // gray-500 (WCAG AA compliant)
    fontSize: typography.caption.fontSize,
    marginBottom: 12,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
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
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: '#e5e7eb', // gray-200
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
    color: '#78716c', // gray-500 (WCAG AA compliant)
    fontSize: typography.tabBar.fontSize,
  },
});

export function themedProgressStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      borderColor: colors.borders.subtle,
    },
    progressBadge: {
      borderColor: colors.borders.warning,
    },
  });
}
