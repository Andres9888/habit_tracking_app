import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export const createNextHabitStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    badge: {
      alignItems: 'center',
      backgroundColor: tc.nextHabitBadgeBg,
      borderRadius: 12,
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: { color: tc.nextHabitBadgeText, fontSize: 12, fontWeight: '600' },
    completedContainer: {
      alignItems: 'center',
      backgroundColor: tc.nextHabitCompletedBg,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 20,
    },
    completedEmoji: { fontSize: 36, marginBottom: 8 },
    completedSubtitle: { color: tc.nextHabitCompletedText, fontSize: 14 },
    completedTitle: {
      color: tc.nextHabitCompletedTitle,
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 4,
    },
    container: {
      backgroundColor: tc.nextHabitBg,
      borderRadius: 16,
      elevation: 3,
      marginHorizontal: 16,
      marginVertical: 8,
      overflow: 'hidden',
      shadowColor: tc.text.primary,
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    content: { padding: 16 },
    glow: {
      backgroundColor: tc.nextHabitIndicatorBg,
      height: 4,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    habitHint: { color: tc.nextHabitHint, fontSize: 13 },
    habitIcon: { fontSize: 32 },
    habitInfo: { flex: 1 },
    habitName: {
      color: tc.nextHabitTitle,
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 2,
    },
    habitRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    progress: { color: tc.nextHabitProgress, fontSize: 13, fontWeight: '500' },
  });

/** @deprecated Light mode defaults - use createNextHabitStyles(themeColors) */
export const styles = createNextHabitStyles({
  nextHabitBadgeBg: '#fef3c7',
  nextHabitBadgeText: '#b45309',
  nextHabitCompletedBg: '#ecfdf5',
  nextHabitCompletedText: '#059669',
  nextHabitCompletedTitle: '#065f46',
  nextHabitBg: '#ffffff',
  nextHabitIndicatorBg: '#f59e0b',
  nextHabitHint: '#a8a29e',
  nextHabitTitle: '#1c1917',
  nextHabitProgress: '#a8a29e',
  text: { primary: '#1c1917' } as any,
} as any);
