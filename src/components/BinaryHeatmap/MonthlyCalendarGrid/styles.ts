/**
 * MonthlyCalendarGrid Styles
 *
 * Theme-neutral layout styles. Colors are applied inline via useThemeColors.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

const WEEK_ROW_HEIGHT = 44;
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
  bareContainer: {
    alignSelf: 'stretch',
    width: '100%',
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayCellCircle: {
    borderRadius: 19,
    height: 38,
    width: 38,
  },
  dayWrapperCircle: {
    height: 44,
  },
  futureFill: {
    backgroundColor: '#F6F3EE',
  },
  // Half-strength green — the History legend lists "Paused" as its own row, so
  // the cell cannot share the plain "not scheduled" surface.
  pausedFill: {
    backgroundColor: '#8FC3AB',
  },
  missedRing: {
    borderColor: '#D6CFC3',
    borderStyle: 'dashed',
    borderWidth: 1.5,
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
  todayText: {
    fontWeight: fontWeights.bold,
  },
});
