/**
 * HabitInput Styles - Extracted style definitions
 */

import { ViewStyle, TextStyle } from 'react-native';
import { BORDER_RADIUS, TOUCH_TARGETS } from '../constants';
import type { SemanticColors } from '@/theme/darkColors';

interface ContainerStyleParams {
  isFocused: boolean;
  colors?: SemanticColors;
  isDark?: boolean;
}

export function getContainerStyle({
  isFocused,
  colors,
  isDark,
}: ContainerStyleParams): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: isDark ? (colors?.card ?? '#1F2937') : '#ffffff',
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 2,
    elevation: isFocused ? 2 : 0,
    flexDirection: 'row',
    height: TOUCH_TARGETS.inputHeight,
    paddingHorizontal: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 8,
    width: '100%',
  };
}

export function getInputTextStyle(colors?: SemanticColors): TextStyle {
  return {
    color: colors?.text.primary ?? '#1C1917',
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
  };
}

/** @deprecated Use getInputTextStyle(colors) instead */
export const inputTextStyle: TextStyle = {
  color: '#1C1917',
  flex: 1,
  fontSize: 17,
  fontWeight: '500',
};

export const clearButtonPressedStyle = (pressed: boolean): ViewStyle => ({
  marginLeft: 8,
  opacity: pressed ? 0.6 : 1,
});

export const characterCounterStyle = (color: string): TextStyle => ({
  color,
  fontSize: 13,
  fontWeight: '500',
  marginLeft: 8,
});
