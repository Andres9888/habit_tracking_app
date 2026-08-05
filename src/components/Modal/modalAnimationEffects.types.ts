/**
 * Modal Animation Effects - Types
 */

import type { SharedValue } from 'react-native-reanimated';

export interface AnimationValues {
  translateY: SharedValue<number>;
  fullScreenProgress: SharedValue<number>;
  fullScreenGestureY: SharedValue<number>;
  scale: SharedValue<number>;
  alertOpacity: SharedValue<number>;
  backdropOpacityValue: SharedValue<number>;
}
