import {
  Easing,
  type SharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { ANIMATION_TIMING } from './constants';

interface CelebrationValues {
  badgeRotate: SharedValue<number>;
  badgeScale: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  continueButtonOpacity: SharedValue<number>;
  continueButtonTranslateY: SharedValue<number>;
  shareButtonOpacity: SharedValue<number>;
  shareButtonTranslateY: SharedValue<number>;
  titleOpacity: SharedValue<number>;
  titleTranslateY: SharedValue<number>;
}

export function applyCelebrationAnimations(
  values: CelebrationValues,
  visible: boolean,
  reduceMotion: boolean
): void {
  if (!visible) {
    values.badgeScale.value = 0;
    values.badgeRotate.value = -15;
    values.titleOpacity.value = 0;
    values.titleTranslateY.value = 20;
    values.contentOpacity.value = 0;
    values.shareButtonOpacity.value = 0;
    values.shareButtonTranslateY.value = 20;
    values.continueButtonOpacity.value = 0;
    values.continueButtonTranslateY.value = 20;
    return;
  }
  if (reduceMotion) {
    values.badgeScale.value = 1;
    values.badgeRotate.value = 0;
    values.titleOpacity.value = 1;
    values.titleTranslateY.value = 0;
    values.contentOpacity.value = 1;
    values.shareButtonOpacity.value = 1;
    values.shareButtonTranslateY.value = 0;
    values.continueButtonOpacity.value = 1;
    values.continueButtonTranslateY.value = 0;
    return;
  }

  values.badgeScale.value = withSequence(
    withSpring(1.2, springs.standard),
    withDelay(
      ANIMATION_TIMING.BADGE_SETTLE_DELAY,
      withSpring(1, springs.standard)
    )
  );
  values.badgeRotate.value = withSpring(0, springs.standard);
  values.titleOpacity.value = withDelay(
    ANIMATION_TIMING.TITLE_DELAY,
    withTiming(1, {
      duration: ANIMATION_TIMING.CONTENT_FADE_DURATION,
      easing: Easing.out(Easing.cubic),
    })
  );
  values.titleTranslateY.value = withDelay(
    ANIMATION_TIMING.TITLE_DELAY,
    withSpring(0, springs.standard)
  );
  values.contentOpacity.value = withDelay(
    ANIMATION_TIMING.TITLE_DELAY + 100,
    withTiming(1, {
      duration: ANIMATION_TIMING.CONTENT_FADE_DURATION,
      easing: Easing.out(Easing.cubic),
    })
  );
  const buttonDelay = ANIMATION_TIMING.TITLE_DELAY + 200;
  values.shareButtonOpacity.value = withDelay(
    buttonDelay,
    withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION })
  );
  values.shareButtonTranslateY.value = withDelay(
    buttonDelay,
    withSpring(0, springs.standard)
  );
  values.continueButtonOpacity.value = withDelay(
    buttonDelay + ANIMATION_TIMING.BUTTON_STAGGER,
    withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION })
  );
  values.continueButtonTranslateY.value = withDelay(
    buttonDelay + ANIMATION_TIMING.BUTTON_STAGGER,
    withSpring(0, springs.standard)
  );
}
