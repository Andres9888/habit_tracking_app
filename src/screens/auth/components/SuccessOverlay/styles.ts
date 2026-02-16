import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../../theme/darkColors';

export const createStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    checkmark: {
      alignItems: 'center',
      backgroundColor: tc.successBg,
      borderRadius: 24,
      height: 80,
      justifyContent: 'center',
      width: 80,
    },
    checkmarkText: {
      color: tc.text.inverse,
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
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      zIndex: 100,
    },
    ring: {
      borderColor: tc.primary[500],
      borderRadius: 9999,
      borderWidth: 3,
      height: 100,
      position: 'absolute',
      width: 100,
    },
    successText: {
      color: tc.authHeading,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginTop: 24,
    },
  });
