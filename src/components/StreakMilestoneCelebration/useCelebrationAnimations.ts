import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { applyCelebrationAnimations } from './applyCelebrationAnimations';

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
    applyCelebrationAnimations(
      {
        badgeRotate,
        badgeScale,
        contentOpacity,
        continueButtonOpacity,
        continueButtonTranslateY,
        shareButtonOpacity,
        shareButtonTranslateY,
        titleOpacity,
        titleTranslateY,
      },
      visible,
      reduceMotion
    );
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
