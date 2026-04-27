/**
 * MonthlyCalendarGrid Styles
 *
 * Theme-neutral layout styles. Colors are applied inline via useThemeColors.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    ...shadows.card,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 16,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
  },
  dayWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: borderRadius.xs,
    bottom: 3,
    height: 5,
    position: 'absolute',
    width: 5,
  },
  headerCell: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 8,
  },
  headerText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  navigation: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
  },
  monthButton: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minWidth: 110,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  weeksContainer: {
    // Fixed height for 6 rows (40px each + 1px margin) prevents layout shift
    // when navigating between months with 5 vs 6 weeks
    minHeight: 6 * 41,
    overflow: 'hidden',
  },
  streakCircle: {
    borderRadius: borderRadius.xs,
    bottom: 3,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  todayText: {
    fontWeight: fontWeights.bold,
  },
});
