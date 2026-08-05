/**
 * Modal Component Styles
 * StyleSheet definitions for Modal variants
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../theme/spacing';
import { SCREEN_HEIGHT } from './Modal.constants';

export const styles = StyleSheet.create({
  bottomSheet: {
    maxHeight: SCREEN_HEIGHT * 0.9,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  centerAlert: {
    alignSelf: 'center',
    maxWidth: 400,
    padding: 24,
    width: '85%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerCenterAlert: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerFullScreen: {
    justifyContent: 'flex-end',
  },
  fullScreen: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  pullIndicator: {
    borderRadius: borderRadius.xs,
    height: 4,
    width: 40,
  },
  pullIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
