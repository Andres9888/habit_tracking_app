import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

/**
 * Theme-aware styles factory for NextHabitSuggestion components.
 * Call getNextHabitStyles(colors) after useThemeColors() in your component.
 */
export const getNextHabitStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    badge: {
      alignItems: 'center',
      backgroundColor: '#fef3c7', // amber-100 — intentional accent color
      borderRadius: 12,
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      color: '#b45309', // amber-700 — intentional accent color
      fontSize: 12,
      fontWeight: '600',
    },
    completedContainer: {
      alignItems: 'center',
      backgroundColor: colors.primary[100] ?? '#ecfdf5', // emerald tint adapts to theme
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 20,
    },
    completedEmoji: { fontSize: 36, marginBottom: 8 },
    completedSubtitle: {
      color: colors.primary[600] ?? '#059669',
      fontSize: 14,
    },
    completedTitle: {
      color: colors.primary[700] ?? '#065f46',
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 4,
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      elevation: 3,
      marginHorizontal: 16,
      marginVertical: 8,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    content: { padding: 16 },
    glow: {
      backgroundColor: '#f59e0b', // amber-500 — intentional accent color
      height: 4,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    habitHint: { color: colors.text.tertiary, fontSize: 13 },
    habitIcon: { fontSize: 32 },
    habitInfo: { flex: 1 },
    habitName: {
      color: colors.text.primary,
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
    progress: { color: colors.text.secondary, fontSize: 13, fontWeight: '500' },
  });
