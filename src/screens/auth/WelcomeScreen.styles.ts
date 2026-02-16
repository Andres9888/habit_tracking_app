/**
 * WelcomeScreen styles — layout-only constants.
 * Colors are applied at runtime via useThemeColors().
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    borderRadius: 16,
    elevation: 4,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
    paddingVertical: 16,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkAction: {
    fontSize: 15,
    fontWeight: '600',
  },
  textLinkLabel: {
    fontSize: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
