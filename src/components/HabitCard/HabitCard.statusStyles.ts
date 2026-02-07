/**
 * HabitCard Status Styles
 * Check circles, streak badges, and warning indicators
 */

import { StyleSheet } from 'react-native';
import { REDESIGN_COLORS } from './HabitCard.colors';

export const statusStyles = StyleSheet.create({
  checkCircle: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkCircleCompleted: {
    backgroundColor: REDESIGN_COLORS.accent,
    borderColor: REDESIGN_COLORS.accent,
  },
  checkCircleUnchecked: {
    backgroundColor: 'transparent',
    borderColor: REDESIGN_COLORS.neutral,
  },
  checkmark: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkmarkText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  streakBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakBadgeCompleted: {
    backgroundColor: REDESIGN_COLORS.accentMuted,
  },
  streakBadgeUnchecked: {
    backgroundColor: 'transparent',
  },
  streakText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  streakTextCompleted: {
    color: REDESIGN_COLORS.accent,
  },
  streakTextUnchecked: {
    color: REDESIGN_COLORS.neutral,
  },
  warningBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  warningText: { fontSize: 12 },
});
