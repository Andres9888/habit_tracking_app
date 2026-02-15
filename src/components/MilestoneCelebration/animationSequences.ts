/**
 * Animation sequence functions for MilestoneCelebration
 */

import {
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ANIMATION_TIMING } from './constants';
import type { AnimationValues } from './types';

const {
  BADGE_BOUNCE_DAMPING,
  BADGE_BOUNCE_STIFFNESS,
  BADGE_SETTLE_DAMPING,
  BADGE_SETTLE_STIFFNESS,
  GLOW_DURATION,
  LABEL_DELAY,
  LABEL_DURATION,
  PERCENTAGE_DURATION,
  SHARE_BUTTON_DELAY,
  CONTINUE_BUTTON_DELAY,
} = ANIMATION_TIMING;
const inOutEase = Easing.inOut(Easing.ease);
const outEase = Easing.out(Easing.ease);

export function runAnimationSequence(anim: AnimationValues, strength: number, reduceMotion = false) {
  if (reduceMotion) {
    // Show everything instantly without motion
    anim.badgeScale.value = 1;
    anim.glowOpacity.value = 0.6;
    anim.labelOpacity.value = 1;
    anim.percentageValue.value = strength;
    anim.shareButtonTranslateY.value = 0;
    anim.shareButtonOpacity.value = 1;
    anim.continueButtonOpacity.value = 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    return;
  }

  anim.badgeScale.value = withSequence(
    withSpring(1.3, {
      damping: BADGE_BOUNCE_DAMPING,
      stiffness: BADGE_BOUNCE_STIFFNESS,
    }),
    withSpring(
      1,
      { damping: BADGE_SETTLE_DAMPING, stiffness: BADGE_SETTLE_STIFFNESS },
      () => {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
      }
    )
  );

  anim.glowOpacity.value = withSequence(
    withTiming(0.8, { duration: GLOW_DURATION, easing: inOutEase }),
    withTiming(0.3, { duration: GLOW_DURATION, easing: inOutEase }),
    withTiming(0.6, { duration: GLOW_DURATION, easing: inOutEase })
  );

  anim.labelOpacity.value = withDelay(
    LABEL_DELAY,
    withTiming(1, { duration: LABEL_DURATION, easing: outEase })
  );

  anim.percentageValue.value = withDelay(
    LABEL_DELAY,
    withTiming(strength, { duration: PERCENTAGE_DURATION, easing: outEase })
  );

  anim.shareButtonTranslateY.value = withDelay(
    SHARE_BUTTON_DELAY,
    withSpring(0, {
      damping: BADGE_SETTLE_DAMPING,
      stiffness: BADGE_SETTLE_STIFFNESS,
    })
  );
  anim.shareButtonOpacity.value = withDelay(
    SHARE_BUTTON_DELAY,
    withTiming(1, { duration: 200 })
  );
  anim.continueButtonOpacity.value = withDelay(
    CONTINUE_BUTTON_DELAY,
    withTiming(1, { duration: LABEL_DURATION })
  );
}

export function resetAnimations(anim: AnimationValues) {
  anim.badgeScale.value = 0;
  anim.glowOpacity.value = 0.3;
  anim.labelOpacity.value = 0;
  anim.percentageValue.value = 0;
  anim.shareButtonTranslateY.value = 50;
  anim.shareButtonOpacity.value = 0;
  anim.continueButtonOpacity.value = 0;
}
