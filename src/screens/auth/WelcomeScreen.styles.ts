/**
 * WelcomeScreen styles — themed via createStyles(colors)
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export const createStyles = (c: SemanticColors) =>
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
      backgroundColor: c.background,
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
      backgroundColor: c.gray[100],
      borderRadius: 16,
      elevation: 4,
      height: 80,
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: c.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      width: 80,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: c.primary[500],
      borderRadius: 12,
      elevation: 4,
      paddingVertical: 16,
      shadowColor: c.primary[500],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    primaryButtonText: {
      color: c.text.inverse,
      fontSize: 17,
      fontWeight: '600',
    },
    subtitle: {
      color: c.text.secondary,
      fontSize: 17,
      textAlign: 'center',
    },
    textLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    textLinkAction: {
      color: c.primary[600],
      fontSize: 15,
      fontWeight: '600',
    },
    textLinkLabel: {
      color: c.text.secondary,
      fontSize: 15,
    },
    title: {
      color: c.text.primary,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -0.5,
      textAlign: 'center',
    },
  });
