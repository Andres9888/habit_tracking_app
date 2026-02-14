/**
 * Layout styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  bottomSpacer: {
    height: 140,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  confettiContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FAFAF9',
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  successGlowOverlay: {
    borderRadius: 12,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
