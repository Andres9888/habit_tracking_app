import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../../theme/darkColors';

export const createStyles = (colors: SemanticColors, isDark: boolean) =>
  StyleSheet.create({
    checkmark: {
      alignItems: 'center',
      backgroundColor: isDark ? colors.primary[500] : '#10b981',
      borderRadius: 24,
      height: 80,
      justifyContent: 'center',
      width: 80,
    },
    checkmarkText: {
      color: colors.text.inverse,
      fontSize: 34,
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
      backgroundColor: isDark
        ? 'rgba(17, 24, 39, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      zIndex: 100,
    },
    ring: {
      borderColor: isDark ? colors.primary[500] : '#10b981',
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
