/**
 * Footer styles for FullsizeTemplatePreview (theme-aware)
 */

import { StyleSheet } from 'react-native';
import { shadows, borderRadius } from '../../../theme/spacing';
import type { SemanticColors } from '../../../../theme/darkColors';

export const createFooterStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    customizeLink: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    customizeLinkText: {
      color: tc.fullsizeFooterSubtext,
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
      backgroundColor: tc.fullsizeFooterButtonBg,
      borderRadius: borderRadius.large,
      height: 56,
      justifyContent: 'center',
      shadowOpacity: 0.15,
    },
    importButtonText: {
      color: tc.fullsizeFooterButtonText,
      fontSize: 17,
      fontWeight: '700',
    },
    successButton: {
      ...shadows.modal,
      alignItems: 'center',
      backgroundColor: tc.fullsizeSuccessGlowBg,
      borderRadius: borderRadius.large,
      flexDirection: 'row',
      gap: 10,
      height: 56,
      justifyContent: 'center',
      shadowColor: tc.success,
      shadowOpacity: 0.3,
    },
    successButtonGlow: {
      backgroundColor: tc.fullsizeSuccessGlowBg,
      borderRadius: borderRadius.xl,
      bottom: -8,
      elevation: 8,
      left: -8,
      position: 'absolute',
      right: -8,
      shadowColor: tc.fullsizeSuccessGlowBg,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      top: -8,
    },
    successButtonText: {
      color: tc.fullsizeFooterButtonText,
      fontSize: 17,
      fontWeight: '700',
    },
    successButtonWrapper: {
      position: 'relative',
    },
  });

/** @deprecated Light mode defaults - use createFooterStyles(themeColors) */
export const footerStyles = createFooterStyles({
  fullsizeFooterSubtext: '#6B7280',
  fullsizeFooterButtonBg: '#22c55e',
  fullsizeFooterButtonText: '#FFFFFF',
  fullsizeSuccessGlowBg: '#22c55e',
  success: '#15803d',
} as any);
