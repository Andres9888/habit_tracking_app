/**
 * QuickCompleteButton Styles
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../theme/spacing';

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
    ...shadows.subtle,
    position: 'absolute',
    shadowOpacity: 0.15,
  },
});
