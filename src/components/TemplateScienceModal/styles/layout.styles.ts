/**
 * Layout styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  bottomSpacer: {
    height: 120,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  container: {
    backgroundColor: '#FAFAF9',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  dismissIndicator: {
    alignItems: 'center',
    left: 0,
    paddingVertical: 8,
    position: 'absolute',
    right: 0,
    top: -50,
    zIndex: 100,
  },
  dismissPill: {
    backgroundColor: '#6B7280',
    borderRadius: 4,
    height: 5,
    marginBottom: 8,
    width: 40,
  },
});
