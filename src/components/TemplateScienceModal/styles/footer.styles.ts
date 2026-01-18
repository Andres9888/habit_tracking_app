/**
 * Footer styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 15,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});
