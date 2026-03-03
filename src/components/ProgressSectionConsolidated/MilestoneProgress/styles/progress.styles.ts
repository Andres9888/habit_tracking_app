import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';

/** Amber-400 border — no exact token in colors.warning scale */
const AMBER_BORDER = '#fbbf24';

export const progressStyles = StyleSheet.create({
  badgeIcon: {
    fontSize: 18,
    marginLeft: spacing.xs,
  },
  container: {
    backgroundColor: colors.text.inverse,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  daysAway: {
    color: colors.gray[500],
    fontSize: 13,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
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
    color: colors.gray[500],
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.md,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: colors.warning[100],
    borderColor: AMBER_BORDER,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginLeft: spacing.sm,
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
    backgroundColor: colors.warning[500],
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.xs,
    flex: 1,
    height: spacing.sm,
    overflow: 'hidden',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabelText: {
    color: colors.gray[500],
    fontSize: typography.tabBar.fontSize,
  },
});
