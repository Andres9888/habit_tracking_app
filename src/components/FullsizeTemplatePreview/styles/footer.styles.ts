/**
 * Footer styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
  customizeLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  customizeLinkText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  footerGradient: {
    paddingTop: 24,
  },
  footerGradientWrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  importButton: {
    alignItems: 'center',
    borderRadius: 16,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#15803d',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  successButtonGlow: {
    backgroundColor: '#22c55e',
    bottom: -8,
    borderRadius: 24,
    left: -8,
    position: 'absolute',
    right: -8,
    elevation: 8,
    top: -8,
    shadowColor: '#22c55e',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  successButtonWrapper: {
    position: 'relative',
  },
});
