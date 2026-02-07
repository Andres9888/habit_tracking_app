/**
 * SignInScreen Styles
 *
 * Stylesheet for the sign-in screen layout and typography.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  appName: {
    color: '#1c1917',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  authContent: {
    gap: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  container: {
    backgroundColor: '#faf9f7',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    color: '#a8a29e',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  formSection: {
    gap: 20,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  socialButtons: {
    gap: 12,
  },
  tagline: {
    color: '#78716c',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeSubtitle: {
    color: '#57534e',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    color: '#1c1917',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});
