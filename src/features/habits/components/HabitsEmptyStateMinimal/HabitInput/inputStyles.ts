/**
 * HabitInput Styles - Extracted style definitions
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, TOUCH_TARGETS } from '../constants';

interface ContainerStyleParams {
  isFocused: boolean;
}

export function getContainerStyle({
  isFocused,
}: ContainerStyleParams): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 2,
    elevation: isFocused ? 2 : 0,
    flexDirection: 'row',
    height: TOUCH_TARGETS.inputHeight,
    paddingHorizontal: 20,
    shadowColor: COLORS.blue500,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 8,
    width: '100%',
  };
}

export const inputTextStyle: TextStyle = {
  color: COLORS.stone800,
  flex: 1,
  fontSize: 16,
  fontWeight: '500',
};

export const clearButtonPressedStyle = (pressed: boolean): ViewStyle => ({
  marginLeft: 8,
  opacity: pressed ? 0.6 : 1,
});

export const characterCounterStyle = (color: string): TextStyle => ({
  color,
  fontSize: 12,
  fontWeight: '500',
  marginLeft: 8,
});
