/**
 * Layout styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';
import { SemanticColors } from '../../../theme/darkColors';

export const createLayoutStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    bottomSpacer: {
      height: 140,
    },
    closeButton: {
      alignItems: 'center',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    confettiContainer: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1000,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 24,
    },
    header: {
      alignItems: 'flex-end',
      paddingBottom: 8,
      paddingHorizontal: 16,
      zIndex: 10,
    },
    successGlowOverlay: {
      borderRadius: 12,
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  });
