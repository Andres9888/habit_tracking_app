/* eslint-disable max-lines */
/** SignInScreen Styles - Type scale: 34/22/17/13, proper contrast, depth */
import { Dimensions, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_ICON_SIZE = Math.min(SCREEN_WIDTH * 0.22, 88);
const RESPONSIVE_LOGO_SIZE = Math.min(SCREEN_WIDTH * 0.2, 80);

export function useSignInStyles() {
  const { colors: themeColors, isDark } = useThemeColors();

  return StyleSheet.create({
    appName: {
      ...typography.displayLarge,
      color: themeColors.text.primary,
      textAlign: 'center',
    } as TextStyle,
    authContent: { gap: 24 },
    brandSection: { alignItems: 'center', marginBottom: 40 },
    container: { flex: 1 },
    flex: { flex: 1 },
    footer: { marginTop: 32, paddingHorizontal: 16 },
    footerLink: {
      color: themeColors.primary[700],
      textDecorationLine: 'underline',
    },
    footerText: {
      ...typography.caption,
      color: themeColors.text.secondary,
      textAlign: 'center',
    } as TextStyle,
    formCard: {
      backgroundColor: themeColors.card,
      borderRadius: 16,
      elevation: 4,
      padding: 24,
      shadowColor: themeColors.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },
    formSection: { gap: 20 },
    gradientBg: { backgroundColor: themeColors.background, flex: 1 },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: themeColors.primary[600],
      borderRadius: 24,
      elevation: 4,
      height: RESPONSIVE_ICON_SIZE,
      justifyContent: 'center',
      marginBottom: 20,
      shadowColor: themeColors.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      width: RESPONSIVE_ICON_SIZE,
    },
    inputFocused: { borderColor: themeColors.primary[700], borderWidth: 2 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
    socialButtons: { gap: 12 },
    tagline: {
      ...typography.body,
      color: themeColors.text.secondary,
      marginTop: 6,
      textAlign: 'center',
    } as TextStyle,
    welcomeSection: { marginBottom: 32 },
    welcomeSubtitle: {
      ...typography.body,
      color: themeColors.text.secondary,
      lineHeight: 24,
      paddingHorizontal: 16,
      textAlign: 'center',
    } as TextStyle,
    welcomeTitle: {
      ...typography.heading1,
      color: themeColors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    } as TextStyle,
  });
}

/** @deprecated Use useSignInStyles() for dark mode support */
export const styles = StyleSheet.create({
  appName: {
    ...typography.displayLarge,
    color: '#1c1917',
    textAlign: 'center',
  } as TextStyle,
  authContent: { gap: 24 },
  brandSection: { alignItems: 'center', marginBottom: 40 },
  container: { flex: 1 },
  flex: { flex: 1 },
  footer: { marginTop: 32, paddingHorizontal: 16 },
  footerLink: { color: colors.primary[700], textDecorationLine: 'underline' },
  footerText: {
    ...typography.caption,
    color: '#57534e',
    textAlign: 'center',
  } as TextStyle,
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    padding: 24,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  formSection: { gap: 20 },
  gradientBg: { backgroundColor: colors.light.background, flex: 1 },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 24,
    elevation: 4,
    height: RESPONSIVE_ICON_SIZE,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: RESPONSIVE_ICON_SIZE,
  },
  inputFocused: { borderColor: colors.primary[700], borderWidth: 2 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  socialButtons: { gap: 12 },
  tagline: {
    ...typography.body,
    color: '#57534e',
    marginTop: 6,
    textAlign: 'center',
  } as TextStyle,
  welcomeSection: { marginBottom: 32 },
  welcomeSubtitle: {
    ...typography.body,
    color: '#57534e',
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  } as TextStyle,
  welcomeTitle: {
    ...typography.heading1,
    color: '#1c1917',
    marginBottom: 8,
    textAlign: 'center',
  } as TextStyle,
});
