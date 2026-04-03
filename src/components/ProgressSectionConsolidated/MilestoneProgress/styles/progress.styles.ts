import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius } from '../../../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

export const progressStyles = StyleSheet.create({
  badgeIcon: {
    fontSize: 17,
    marginLeft: 4,
  },
  container: {
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  daysAway: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
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
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: '600',
  },
  milestoneName: {
    color: colors.gray[400],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginBottom: 12,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderColor: colors.streak[300],
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginLeft: 8,
    width: 24,
  },
  progressBadgeText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
  },
  progressBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  progressBarFill: {
    backgroundColor: colors.streak[300],
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
    color: colors.gray[400],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
  },
});
