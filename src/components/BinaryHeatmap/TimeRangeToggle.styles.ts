/**
 * Styles for TimeRangeToggle Component
 */

import { StyleSheet } from 'react-native';

import { COLORS, FOCUS } from './constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    borderRadius: 8,
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
