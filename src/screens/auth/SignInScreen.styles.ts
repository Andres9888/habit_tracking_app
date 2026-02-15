/** SignInScreen Styles - Type scale: 34/22/17/13, proper contrast, depth */

import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  appName: {
    color: '#1c1917',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
  },
  authContent: { gap: 24 },
  brandSection: { alignItems: 'center', marginBottom: 40 },
  container: { flex: 1 },
  flex: { flex: 1 },
  footer: { marginTop: 32, paddingHorizontal: 16 },
  footerLink: { color: '#047857', textDecorationLine: 'underline' },
  footerText: {
    color: '#57534e',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
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
    backgroundColor: '#059669',
    borderRadius: 24,
    elevation: 4,
    height: 88,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 88,
  },
  inputFocused: { borderColor: '#047857', borderWidth: 2 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  socialButtons: { gap: 12 },
  tagline: {
    color: '#57534e',
    fontSize: 17,
    marginTop: 6,
    textAlign: 'center',
  },
  welcomeSection: { marginBottom: 32 },
  welcomeSubtitle: {
    color: '#57534e',
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    color: '#1c1917',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
});
