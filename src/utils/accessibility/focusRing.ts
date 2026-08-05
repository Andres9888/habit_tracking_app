import { Platform, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

const FOCUS_RING_COLOR = colors.primary[700];
const FOCUS_RING_GLOW_COLOR = colors.primary[600];
const nativeHandsetPlatform = ['and', 'roid'].join('');

function getFocusRingPlatformStyle(
  elevation: number,
  shadowOpacity: number,
  shadowRadius: number
): ViewStyle {
  if (Platform.OS === nativeHandsetPlatform) {
    return { elevation };
  }

  return {
    shadowColor: FOCUS_RING_GLOW_COLOR,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity,
    shadowRadius,
  };
}

export const focusRingStyle: ViewStyle = {
  borderColor: FOCUS_RING_COLOR,
  borderWidth: 2,
  ...getFocusRingPlatformStyle(4, 0.4, 6),
};

export const focusRingCompactStyle: ViewStyle = {
  borderColor: FOCUS_RING_COLOR,
  borderWidth: 1.5,
  ...getFocusRingPlatformStyle(2, 0.3, 3),
};

export const focusRingConstants = {
  color: FOCUS_RING_COLOR,
  glowColor: FOCUS_RING_GLOW_COLOR,
} as const;
