
import { Platform, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

const FOCUS_RING_COLOR = colors.primary[700];
const FOCUS_RING_GLOW_COLOR = colors.primary[600];

export const focusRingStyle: ViewStyle = {
  borderColor: FOCUS_RING_COLOR,
  borderWidth: 2,
  ...Platform.select({
    android: { elevation: 4 },
    ios: {
      shadowColor: FOCUS_RING_GLOW_COLOR,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
    },
  }),
};

export const focusRingCompactStyle: ViewStyle = {
  borderColor: FOCUS_RING_COLOR,
  borderWidth: 1.5,
  ...Platform.select({
    android: { elevation: 2 },
    ios: {
      shadowColor: FOCUS_RING_GLOW_COLOR,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  }),
};

export const focusRingConstants = {
  color: FOCUS_RING_COLOR,
  glowColor: FOCUS_RING_GLOW_COLOR,
} as const;
