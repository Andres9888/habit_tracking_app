import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { ANIMATION_TIMING } from './constants';

const SPRING_CONFIG = springs.standard;

export function useCelebrationAnimations(
  visible: boolean,
  reduceMotion: boolean
) {
  const badgeScale = useSharedValue(0);
  const badgeRotate = useSharedValue(-15);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const shareButtonOpacity = useSharedValue(0);
  const shareButtonTranslateY = useSharedValue(20);
  const continueButtonOpacity = useSharedValue(0);
  const continueButtonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (!visible) {
      badgeScale.value = 0;
      badgeRotate.value = -15;
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      contentOpacity.value = 0;
      shareButtonOpacity.value = 0;
      shareButtonTranslateY.value = 20;
      continueButtonOpacity.value = 0;
      continueButtonTranslateY.value = 20;
      return;
    }
    if (reduceMotion) {
      badgeScale.value = 1;
      badgeRotate.value = 0;
      titleOpacity.value = 1;
      titleTranslateY.value = 0;
      contentOpacity.value = 1;
      shareButtonOpacity.value = 1;
      shareButtonTranslateY.value = 0;
      continueButtonOpacity.value = 1;
      continueButtonTranslateY.value = 0;
    } else {
      badgeScale.value = withSequence(
        withSpring(1.2, SPRING_CONFIG),
        withDelay(
          ANIMATION_TIMING.BADGE_SETTLE_DELAY,
          withSpring(1, SPRING_CONFIG)
        )
      );
      badgeRotate.value = withSpring(0, SPRING_CONFIG);
      titleOpacity.value = withDelay(
        ANIMATION_TIMING.TITLE_DELAY,
        withTiming(1, {
          duration: ANIMATION_TIMING.CONTENT_FADE_DURATION,
          easing: Easing.out(Easing.cubic),
        })
      );
      titleTranslateY.value = withDelay(
        ANIMATION_TIMING.TITLE_DELAY,
        withSpring(0, SPRING_CONFIG)
      );
      contentOpacity.value = withDelay(
        ANIMATION_TIMING.TITLE_DELAY + 100,
        withTiming(1, {
          duration: ANIMATION_TIMING.CONTENT_FADE_DURATION,
          easing: Easing.out(Easing.cubic),
        })
      );
      const bd = ANIMATION_TIMING.TITLE_DELAY + 200;
      shareButtonOpacity.value = withDelay(
        bd,
        withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION })
      );
      shareButtonTranslateY.value = withDelay(bd, withSpring(0, SPRING_CONFIG));
      continueButtonOpacity.value = withDelay(
        bd + ANIMATION_TIMING.BUTTON_STAGGER,
        withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION })
      );
      continueButtonTranslateY.value = withDelay(
        bd + ANIMATION_TIMING.BUTTON_STAGGER,
        withSpring(0, SPRING_CONFIG)
      );
    }
  }, [visible, reduceMotion]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: badgeScale.value },
      { rotate: `${badgeRotate.value}deg` },
    ],
  }));
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));
  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shareButtonOpacity.value,
    transform: [{ translateY: shareButtonTranslateY.value }],
  }));
  const continueButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: continueButtonOpacity.value,
    transform: [{ translateY: continueButtonTranslateY.value }],
  }));

  return {
    badgeAnimatedStyle,
    contentAnimatedStyle,
    continueButtonAnimatedStyle,
    shareButtonAnimatedStyle,
    titleAnimatedStyle,
  };
}
