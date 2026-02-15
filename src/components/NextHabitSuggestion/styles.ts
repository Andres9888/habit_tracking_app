import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

/**
 * Creates theme-aware styles for NextHabitSuggestion widget.
 * Consistent card styling: borderRadius 16, design-system shadows, padding 16.
 */
export function createStyles(colors: SemanticColors, isDark: boolean) {
  return StyleSheet.create({
    badge: {
      alignItems: 'center',
      backgroundColor: isDark ? '#78350f' : '#fef3c7',
      borderRadius: 12,
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      color: isDark ? '#fbbf24' : '#b45309',
      fontSize: 12,
      fontWeight: '600',
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      elevation: 3,
      marginHorizontal: 16,
      marginVertical: 8,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
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
      backgroundColor: isDark ? '#064E3B' : '#ecfdf5',
      shadowColor: '#000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    },
    glow: {
      backgroundColor: '#f59e0b',
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
      color: colors.text.tertiary,
      fontSize: 13,
    },
    completedSubtitle: {
      color: isDark ? '#34D399' : '#059669',
      fontSize: 14,
    },
    habitIcon: {
      fontSize: 32,
    },
    completedTitle: {
      color: isDark ? '#A7F3D0' : '#065f46',
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 4,
    },
    habitRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
    },
    habitInfo: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    habitName: {
      color: colors.text.primary,
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 2,
    },
    progress: {
      fontSize: 13,
      color: colors.text.tertiary,
      fontWeight: '500',
    },
  });
}

// Legacy export for backward compat — will be removed
export const styles = createStyles(
  {
    card: '#ffffff',
    text: { primary: '#1c1917', secondary: '#6B6560', tertiary: '#a8a29e', inverse: '#FFFFFF' },
  } as any,
  false,
);
