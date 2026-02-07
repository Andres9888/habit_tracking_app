/**
 * Styles for TimeRangeToggle Component
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../theme/spacing';
import { COLORS, FOCUS } from './constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonActive: {
    ...shadows.subtle,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  buttonTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  buttonTextInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
  container: {
    backgroundColor: '#f5f5f4',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    padding: 2,
  },
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  },
});
