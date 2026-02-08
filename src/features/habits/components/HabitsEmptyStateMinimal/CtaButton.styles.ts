/**
 * CtaButton styles
 */

import type { ViewStyle } from 'react-native';
import { BORDER_RADIUS, TOUCH_TARGETS } from './constants';

export function getCtaButtonStyle(isDisabled: boolean): ViewStyle {
  return {
    alignItems: 'center',
    // Using emerald-700 for WCAG AA contrast (5.21:1 with white text)
    backgroundColor: '#047857',
    borderRadius: BORDER_RADIUS.cta,
    elevation: isDisabled ? 0 : 4,
    height: TOUCH_TARGETS.ctaHeight,
    justifyContent: 'center',
    opacity: isDisabled ? 0.4 : 1,
    overflow: 'hidden',
    paddingVertical: 16,
    // Shadow for depth
    shadowColor: '#047857',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: '100%',
  };
}

export const ctaTextStyle = {
  color: '#ffffff',
  fontSize: 17,
  fontWeight: '600' as const,
};
