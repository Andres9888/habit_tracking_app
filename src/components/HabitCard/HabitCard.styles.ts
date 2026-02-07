/**
 * HabitCard Core Styles
 * Implements home-screen-redesign-spec.md:
 * - Height: 76px | Border-radius: 14px
 * - Card surface: #FFFFFF | Border: 1px #E5E2DE
 * OPTIMIZED: SF Pro font, deeper shadows, proper contrast
 */

import { StyleSheet, Platform } from 'react-native';
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
    borderRadius: 14,
    borderWidth: 1,
    elevation: 3,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#2D2A26',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  // Card container background for depth
  cardsContainer: {
    backgroundColor: REDESIGN_COLORS.cardBg,
    borderRadius: 20,
    marginHorizontal: 12,
    padding: 12,
  },
  completedText: { opacity: 0.7 },
  container: { height: 76, marginVertical: 5, position: 'relative' },
  content: { flex: 1, justifyContent: 'center', padding: 16 },
  disabled: { opacity: 0.5 },
  habitInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
  // Meta text for habit strength
  habitMeta: {
    color: REDESIGN_COLORS.metaText,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18,
    marginTop: 2,
  },
  habitName: {
    color: REDESIGN_COLORS.secondaryText,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  icon: { fontSize: 26 },
  // Streak text with proper contrast
  streakText: {
    color: REDESIGN_COLORS.streakText,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 15,
    fontWeight: '600',
  },
  strengthFill: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export const styles = { ...coreStyles, ...statusStyles };
