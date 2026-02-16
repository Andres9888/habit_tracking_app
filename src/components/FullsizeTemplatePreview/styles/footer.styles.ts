/**
 * Footer styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../theme/spacing';
import { SemanticColors } from '../../../theme/darkColors';

export const createFooterStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    customizeLink: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    customizeLinkText: {
      color: colors.text.secondary,
      fontSize: 15,
      fontWeight: '600',
    },
    footer: {
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    footerGradient: {
      paddingTop: 24,
    },
    footerGradientWrapper: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    importButton: {
      ...shadows.modal,
      alignItems: 'center',
      borderRadius: borderRadius.large,
      height: 56,
      justifyContent: 'center',
      shadowOpacity: 0.15,
    },
    importButtonText: {
      color: colors.text.inverse,
      fontSize: 17,
      fontWeight: '700',
    },
    successButton: {
      ...shadows.modal,
      alignItems: 'center',
      backgroundColor: colors.success.primary,
      borderRadius: borderRadius.large,
      flexDirection: 'row',
      gap: 10,
      height: 56,
      justifyContent: 'center',
      shadowColor: colors.success.border,
      shadowOpacity: 0.3,
    },
    successButtonGlow: {
      backgroundColor: colors.success.primary,
      borderRadius: borderRadius.xl,
      bottom: -8,
      elevation: 8,
      left: -8,
      position: 'absolute',
      right: -8,
      shadowColor: colors.success.primary,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      top: -8,
    },
    successButtonText: {
      color: colors.text.inverse,
      fontSize: 17,
      fontWeight: '700',
    },
    successButtonWrapper: {
      position: 'relative',
    },
  });
