/**
 * MonthlyCalendarGrid Styles
 *
 * Theme-neutral layout styles. Colors are applied inline via useThemeColors.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

const WEEK_ROW_HEIGHT = 41;
const MONTH_GRID_HEIGHT = 6 * WEEK_ROW_HEIGHT;

export const styles = StyleSheet.create({
  container: {
    ...shadows.card,
    alignSelf: 'stretch',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 16,
    width: '100%',
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
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: 118,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    flexShrink: 0,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  weeksContainer: {
    height: MONTH_GRID_HEIGHT,
    overflow: 'hidden',
  },
  weeksPage: {
    height: MONTH_GRID_HEIGHT,
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
