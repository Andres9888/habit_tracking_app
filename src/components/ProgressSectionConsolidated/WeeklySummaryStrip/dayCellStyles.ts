/**
 * WeeklySummaryStrip - Day Cell Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '@/theme/typography';

export const dayCellStyles = StyleSheet.create({
  dayCellContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayCircleRing: {
    elevation: 4,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dayLabel: {
    ...typography.tabBar,
    color: '#a8a29e', // stone-400
    marginBottom: 6,
  },
  dayPressable: {
    flex: 1,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  todayText: {
    ...typography.tabBar,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
