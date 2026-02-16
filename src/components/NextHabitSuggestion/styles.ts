import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export const createNextHabitSuggestionStyles = (tc: SemanticColors) =>
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
    badgeText: {
      color: tc.nextHabitBadgeText,
      fontSize: 12,
      fontWeight: '600',
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
    content: {
      padding: 16,
    },
    completedContainer: {
      marginHorizontal: 16,
      borderRadius: 16,
      marginVertical: 8,
      alignItems: 'center',
      padding: 20,
      backgroundColor: tc.nextHabitCompletedBg,
    },
    glow: {
      backgroundColor: tc.nextHabitIndicatorBg,
      height: 4,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    completedEmoji: {
      fontSize: 36,
      marginBottom: 8,
    },
    habitHint: {
      color: tc.nextHabitHint,
      fontSize: 13,
    },
    completedSubtitle: {
      color: tc.nextHabitCompletedText,
      fontSize: 14,
    },
  });

/** @deprecated Light mode defaults - use createNextHabitSuggestionStyles(themeColors) */
export const styles = createNextHabitSuggestionStyles({
  nextHabitBadgeBg: '#fef3c7',
  nextHabitBadgeText: '#b45309',
  nextHabitBg: '#ffffff',
  nextHabitIndicatorBg: '#f59e0b',
  nextHabitHint: '#a8a29e',
  nextHabitCompletedBg: '#ecfdf5',
  nextHabitCompletedText: '#059669',
  text: { primary: '#1c1917' } as any,
} as any);
