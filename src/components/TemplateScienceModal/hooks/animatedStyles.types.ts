/**
 * Types for useAnimatedStyles hook
 */

import type { SharedValue } from 'react-native-reanimated';

export interface AnimationValues {
  backButtonScale: SharedValue<number>;
  card1Progress: SharedValue<number>;
  card2Progress: SharedValue<number>;
  card3Progress: SharedValue<number>;
  closeButtonScale: SharedValue<number>;
  dismissProgress: SharedValue<number>;
  footerProgress: SharedValue<number>;
  headerTitleOpacity: SharedValue<number>;
  heroOpacity: SharedValue<number>;
  heroScale: SharedValue<number>;
  iconGlowOpacity: SharedValue<number>;
  iconGlowScale: SharedValue<number>;
  linkButtonScale: SharedValue<number>;
  scrollY: SharedValue<number>;
  shareButtonScale: SharedValue<number>;
  translateY: SharedValue<number>;
  youtubeButtonScale: SharedValue<number>;
}
