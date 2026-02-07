/**
 * WelcomeScreen styles
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
    backgroundColor: '#faf9f7',
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
    backgroundColor: '#f5f5f4',
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    width: 80,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 14,
    elevation: 4,
    paddingVertical: 16,
    shadowColor: '#059669',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    color: '#78716c',
    fontSize: 17,
    textAlign: 'center',
  },
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkAction: {
    color: '#047857',
    fontSize: 15,
    fontWeight: '600',
  },
  textLinkLabel: {
    color: '#78716c',
    fontSize: 15,
  },
  title: {
    color: '#1c1917',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
