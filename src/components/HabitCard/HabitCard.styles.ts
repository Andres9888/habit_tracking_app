/**
 * HabitCard Core Styles
 * Implements home-screen-redesign-spec.md:
 * - Height: 72px | Border-radius: 12px
 * - Card surface: #FFFFFF | Border: 1px #C4BFB7
 */

import { StyleSheet } from 'react-native';
import { REDESIGN_COLORS } from './HabitCard.colors';
import { statusStyles } from './HabitCard.statusStyles';

export { actionStyles } from './HabitCard.actionStyles';
export { REDESIGN_COLORS } from './HabitCard.colors';

const coreStyles = StyleSheet.create({
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
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export const styles = { ...coreStyles, ...statusStyles };
