/**
 * WelcomeScreen styles
 * Dark mode aware — uses semantic color tokens from theme
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing, shadows } from '@/theme/spacing';
import type { SemanticColors } from '@/theme/darkColors';

export const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    actionSection: {
      gap: spacing.md,
    },
    backButton: {
      left: spacing.base,
      position: 'absolute',
      zIndex: 10,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: spacing['2xl'],
      paddingHorizontal: spacing.lg,
    },
    heroSection: {
      alignItems: 'center',
      gap: spacing.md,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      borderRadius: borderRadius.large,
      height: 80,
      justifyContent: 'center',
      marginBottom: spacing.sm,
      width: 80,
      ...shadows.floatingActionButton,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[600],
      borderRadius: borderRadius.button,
      paddingVertical: spacing.base,
      ...shadows.floatingActionButton,
      shadowColor: colors.primary[600],
      shadowOpacity: 0.2,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 17,
      fontWeight: '600',
    },
    subtitle: {
      color: colors.text.secondary,
      fontSize: 17,
      textAlign: 'center',
    },
    textLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    textLinkAction: {
      color: colors.primary[500],
      fontSize: 15,
      fontWeight: '600',
    },
    textLinkLabel: {
      color: colors.text.secondary,
      fontSize: 15,
    },
    title: {
      color: colors.text.primary,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -0.5,
      textAlign: 'center',
    },
  });

// Legacy static export for any remaining imports
export const styles = createStyles({
  background: '#FAF8F5',
  border: '#DDD8D2',
  card: '#EDEAE5',
  cardBorder: '#DDD8D2',
  gray: {
    50: '#FAF8F5', 100: '#F5F1ED', 200: '#DDD8D2', 300: '#C4BFB7',
    400: '#9C958D', 500: '#6B6560', 600: '#524D47', 700: '#3D3833',
    800: '#2D2A26', 900: '#1A1816',
  },
  primary: {
    100: '#D4F0E2', 300: '#6FCF9A', 400: '#3FBD7E',
    500: '#2A9D6E', 600: '#22805A', 700: '#1B6B4A',
  },
  surface: '#EDEAE5',
  text: { primary: '#2D2A26', secondary: '#6B6560', tertiary: '#9C958D', inverse: '#FFFFFF' },
});
