/**
 * HabitCard Streak Styles
 * StyleSheet definitions for streak badges
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const streakStyles = StyleSheet.create({
  bestStreakBadge: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bestStreakIcon: {
    fontSize: 12,
  },
  bestStreakText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rippleOverlay: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    height: 40,
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    position: 'absolute',
    top: '50%',
    width: 40,
  },
  streakBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakFireIcon: {
    fontSize: 14,
  },
  streakRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
    marginTop: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
