import { StyleSheet } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

export function useStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    badge: {
      alignItems: 'center',
      backgroundColor: colors.status.warning.bg,
      borderRadius: 12,
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: { color: colors.status.warning.text, fontSize: 12, fontWeight: '600' },
    completedContainer: {
      alignItems: 'center',
      backgroundColor: colors.status.success.bg,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 20,
    },
    completedEmoji: { fontSize: 36, marginBottom: 8 },
    completedSubtitle: { color: colors.primary[600], fontSize: 14 },
    completedTitle: {
      color: colors.status.success.text,
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
      shadowColor: colors.gray[900],
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    content: { padding: 16 },
    glow: {
      backgroundColor: colors.status.warning.text,
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
    progress: { color: colors.text.tertiary, fontSize: 13, fontWeight: '500' },
  });
}

/** @deprecated Use useStyles() for dark mode support */
export const styles = {} as ReturnType<typeof useStyles>;
