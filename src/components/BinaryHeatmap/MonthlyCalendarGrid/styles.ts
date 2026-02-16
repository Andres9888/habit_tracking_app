/**
 * MonthlyCalendarGrid Styles
 *
 * Compact styles for above-fold layout.
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
  circle: {
    borderRadius: 6,
    bottom: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  container: {
    ...shadows.card,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    marginTop: 12,
    padding: 16,
    shadowColor: '#1c1917',
    shadowOpacity: 0.05,
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
    color: COLORS.TEXT_SECONDARY,
    fontSize: typography.tabBar.fontSize,
    fontWeight: '500',
  },
  monthButton: {
    alignItems: 'center',
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  navButton: {
    alignItems: 'center',
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navigation: {
    alignItems: 'center',
    borderTopColor: COLORS.BORDER,
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
  streakCircle: {
    borderRadius: 6,
    bottom: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  todayText: {
    fontWeight: '700',
  },
});
