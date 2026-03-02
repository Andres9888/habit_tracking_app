/**
 * MonthlyCalendarGrid Styles
 *
 * Theme-neutral layout styles. Colors are applied inline via useThemeColors.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius as br } from '../../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    ...shadows.card,
    borderRadius: br.large,
    borderWidth: 1,
    padding: 16,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  dayWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 2.5,
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
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 10,
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
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  streakCircle: {
    borderRadius: 5,
    bottom: 3,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  todayText: {
    fontWeight: '700',
  },
});
