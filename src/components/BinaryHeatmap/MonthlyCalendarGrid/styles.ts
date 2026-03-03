/**
 * MonthlyCalendarGrid Styles
 *
 * Layout-only styles. Colors applied inline via theme system.
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    ...shadows.card,
    borderRadius: 16,
    marginTop: 12,
    padding: 16,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  dayWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 38,
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
  },
  headerText: {
    fontSize: typography.tabBar.fontSize,
    fontWeight: '500',
  },
  monthButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navigation: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  todayText: {
    fontWeight: '700',
  },
});
