/**
 * CtaButton styles
 */

import type { TextStyle, ViewStyle } from 'react-native';
import { BORDER_RADIUS, TOUCH_TARGETS } from './constants';
import type { SemanticColors } from '@/theme/darkColors';

export function getCtaButtonStyle(isDisabled: boolean, colors?: SemanticColors): ViewStyle {
  const bgColor = colors?.primary[700] ?? '#047857';
  return {
    alignItems: 'center',
    backgroundColor: bgColor,
    borderRadius: BORDER_RADIUS.cta,
    elevation: isDisabled ? 0 : 4,
    height: TOUCH_TARGETS.ctaHeight,
    justifyContent: 'center',
    opacity: isDisabled ? 0.4 : 1,
    overflow: 'hidden',
    paddingVertical: 16,
    shadowColor: bgColor,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  };
}

export function getCtaTextStyle(colors?: SemanticColors): TextStyle {
  return {
    color: colors?.text.inverse ?? '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  };
}

/** @deprecated Use getCtaTextStyle(colors) instead */
export const ctaTextStyle: TextStyle = {
  color: '#ffffff',
  fontSize: 15,
  fontWeight: '600',
};
