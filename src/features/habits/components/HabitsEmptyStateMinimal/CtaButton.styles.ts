/**
 * CtaButton styles
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { fontFamilies } from '@/theme/typography';
import { BORDER_RADIUS, TOUCH_TARGETS } from './constants';

export function getCtaButtonStyle(
  isDisabled: boolean,
  backgroundColor: string,
  shadowColor: string
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor,
    borderRadius: BORDER_RADIUS.cta,
    elevation: isDisabled ? 0 : 4,
    height: TOUCH_TARGETS.ctaHeight,
    justifyContent: 'center',
    opacity: isDisabled ? 0.4 : 1,
    overflow: 'hidden',
    paddingVertical: 16,
    // Shadow for depth
    shadowColor,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: isDisabled ? 0 : 0.3,
    shadowRadius: 12,
    width: '100%',
  };
}

export function getCtaTextStyle(color: string): TextStyle {
  return {
    color,
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  };
}
