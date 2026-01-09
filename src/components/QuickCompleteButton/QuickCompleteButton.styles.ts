/**
 * QuickCompleteButton Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  buttonWrapper: {
    overflow: 'visible',
    position: 'relative',
  },
  confettiContainer: {
    height: 0,
    left: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    width: 0,
    zIndex: 100,
  },
  confettiParticle: {
    elevation: 2,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
