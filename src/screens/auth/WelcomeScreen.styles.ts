/**
 * WelcomeScreen styles — theme-aware
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export const createStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    actionSection: {
      gap: 12,
    },
    backButton: {
      left: 16,
      position: 'absolute',
      zIndex: 10,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    container: {
      backgroundColor: tc.authBg,
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: 48,
      paddingHorizontal: 24,
    },
    heroSection: {
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: tc.authSurface,
      borderRadius: 16,
      elevation: 4,
      height: 80,
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: tc.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      width: 80,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: tc.primary[600],
      borderRadius: 12,
      elevation: 4,
      paddingVertical: 16,
      shadowColor: tc.primary[600],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    primaryButtonText: {
      color: tc.text.inverse,
      fontSize: 17,
      fontWeight: '600',
    },
    subtitle: {
      color: tc.authMuted,
      fontSize: 17,
      textAlign: 'center',
    },
    textLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    textLinkAction: {
      color: tc.primary[700],
      fontSize: 15,
      fontWeight: '600',
    },
    textLinkLabel: {
      color: tc.authMuted,
      fontSize: 15,
    },
    title: {
      color: tc.authHeading,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -0.5,
      textAlign: 'center',
    },
  });
