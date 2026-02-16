/**
 * WelcomeScreen styles
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export const createStyles = (colors: SemanticColors) => StyleSheet.create({
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    elevation: 4,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: colors.text.primary,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    elevation: 4,
    paddingVertical: 16,
    shadowColor: colors.primary[500],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.text.tertiary,
    fontSize: 17,
    textAlign: 'center',
  } as TextStyle,
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkAction: {
    color: colors.primary[600],
    fontSize: 15,
    fontWeight: '600',
  } as TextStyle,
  textLinkLabel: {
    color: colors.text.tertiary,
    fontSize: 15,
  },
  title: {
    color: colors.text.primary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  } as TextStyle,
});
