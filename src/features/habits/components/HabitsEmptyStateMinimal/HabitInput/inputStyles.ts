/**
 * HabitInput Styles - Extracted style definitions
 */

import { ViewStyle, TextStyle } from 'react-native';
import { fontFamilies } from '@/theme/typography';
import { BORDER_RADIUS, TOUCH_TARGETS } from '../constants';

interface ContainerStyleParams {
  isFocused: boolean;
  backgroundColor: string;
  shadowColor: string;
}

export function getContainerStyle({
  isFocused,
  backgroundColor,
  shadowColor,
}: ContainerStyleParams): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1.5,
    elevation: isFocused ? 2 : 0,
    flexDirection: 'row',
    height: TOUCH_TARGETS.inputHeight,
    paddingHorizontal: 16,
    shadowColor,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 8,
    width: '100%',
  };
}

export function getInputTextStyle(color: string): TextStyle {
  return {
    color,
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: '500',
  };
}

export const clearButtonPressedStyle = (pressed: boolean): ViewStyle => ({
  marginLeft: 8,
  opacity: pressed ? 0.6 : 1,
});

export const characterCounterStyle = (color: string): TextStyle => ({
  color,
  fontFamily: fontFamilies.primary.text,
  fontSize: 13,
  fontWeight: '500',
  marginLeft: 8,
});

export const placeholderOverlayStyle = (color: string): TextStyle => ({
  color,
  fontFamily: fontFamilies.primary.text,
  fontSize: 15,
  fontWeight: '400',
  left: 16,
  position: 'absolute',
});
