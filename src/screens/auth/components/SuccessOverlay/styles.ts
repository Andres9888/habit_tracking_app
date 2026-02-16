import { StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function useSuccessOverlayStyles() {
  const { colors, isDark } = useThemeColors();

  return StyleSheet.create({
    checkmark: {
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      borderRadius: 24,
      height: 80,
      justifyContent: 'center',
      width: 80,
    },
    checkmarkText: {
      color: colors.text.inverse,
      fontSize: 40,
      fontWeight: 'bold',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      alignItems: 'center',
      height: 120,
      justifyContent: 'center',
      width: 120,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      zIndex: 100,
    },
    ring: {
      borderColor: colors.primary[500],
      borderRadius: 9999,
      borderWidth: 3,
      height: 100,
      position: 'absolute',
      width: 100,
    },
    successText: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginTop: 24,
    },
  });
}
