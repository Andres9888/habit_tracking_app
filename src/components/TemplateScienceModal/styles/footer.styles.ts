/**
 * Footer styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';
import type { SemanticColors } from '../../../theme/darkColors';

export const footerStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    gap: 8,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footerGradient: {
    bottom: 0,
    left: 0,
    paddingTop: 24,
    position: 'absolute',
    right: 0,
  },
  useButton: {
    ...shadows.modal,
    shadowOpacity: 0.15,
  },
});

export function themedFooterStyles(colors: SemanticColors) {
  return {
    backButtonText: { color: colors.text.secondary },
  } as const;
}
