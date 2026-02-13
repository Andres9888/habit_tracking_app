/**
 * Styles for ErrorFallback component
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 16, marginTop: 16 },
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 300,
    textAlign: 'center',
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  errorMessage: {
    color: colors.error,
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 24,
    maxWidth: 300,
  },
  headline: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  link: { padding: 8 },
  linkText: { color: colors.primary[600], fontSize: 14, fontWeight: '500' },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoutText: { color: colors.text.inverse, fontSize: 16, fontWeight: '600' },
  safetyNote: {
    color: colors.primary[700],
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
