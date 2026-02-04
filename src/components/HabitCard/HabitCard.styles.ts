/**
 * HabitCard Core Styles
 * Implements home-screen-redesign-spec.md:
 * - Height: 72px | Border-radius: 12px
 * - Card surface: #FFFFFF | Border: 1px #C4BFB7
 */

import { StyleSheet } from 'react-native';

export { actionStyles } from './HabitCard.actionStyles';

export const REDESIGN_COLORS = {
  accent: '#E85D3B',
  accentMuted: '#F5DDD6',
  cardSurface: '#FFFFFF',
  dominant: '#FAF8F5',
  neutral: '#C4BFB7',
  secondaryText: '#2D2A26',
} as const;

export const styles = StyleSheet.create({
  accentBar: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  card: {
    backgroundColor: REDESIGN_COLORS.cardSurface,
    borderColor: REDESIGN_COLORS.neutral,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: 'rgba(45, 42, 38, 0.04)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
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
  completedText: { opacity: 0.7 },
  container: { height: 72, marginVertical: 6, position: 'relative' },
  content: { flex: 1, justifyContent: 'center', padding: 16 },
  disabled: { opacity: 0.5 },
  habitInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  habitName: {
    color: REDESIGN_COLORS.secondaryText,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 22,
    letterSpacing: -0.44,
    lineHeight: 26,
  },
  icon: { fontSize: 24 },
  strengthFill: { bottom: 0, left: 0, position: 'absolute', top: 0 },
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
    fontFamily: 'SourceSans3-Medium',
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
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
