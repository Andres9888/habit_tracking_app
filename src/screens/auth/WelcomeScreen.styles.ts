/**
 * WelcomeScreen styles — dark mode aware
 */

import { StyleSheet, TextStyle } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';

export function useWelcomeStyles() {
  const { colors: themeColors } = useThemeColors();

  return StyleSheet.create({
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
      backgroundColor: themeColors.background,
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
      backgroundColor: themeColors.card,
      borderRadius: 16,
      elevation: 4,
      height: 80,
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: themeColors.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      width: 80,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: themeColors.primary[600],
      borderRadius: 12,
      elevation: 4,
      paddingVertical: 16,
      shadowColor: themeColors.primary[600],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    primaryButtonText: {
      ...typography.button,
      color: themeColors.text.inverse,
    } as TextStyle,
    subtitle: {
      ...typography.body,
      color: themeColors.text.secondary,
      textAlign: 'center',
    } as TextStyle,
    textLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    textLinkAction: {
      ...typography.bodySmall,
      color: themeColors.primary[700],
      fontWeight: '600',
    } as TextStyle,
    textLinkLabel: {
      ...typography.bodySmall,
      color: themeColors.text.secondary,
    } as TextStyle,
    title: {
      ...typography.displayLarge,
      color: themeColors.text.primary,
      textAlign: 'center',
    } as TextStyle,
  });
}
