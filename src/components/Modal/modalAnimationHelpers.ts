/**
 * Modal Animation Helpers
 * Common animation utilities
 */

import { Easing, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const fadeIn = (duration: number) => ({
  duration,
  easing: Easing.out(Easing.cubic),
});

export const fadeOut = (duration: number) => ({
  duration,
  easing: Easing.in(Easing.cubic),
});

export const hapticCallback = (finished?: boolean) => {
  if (finished) runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
};
