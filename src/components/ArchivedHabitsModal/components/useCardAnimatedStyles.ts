
import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';

import { CARD_ANIMATION_DURATION, CARD_ANIMATION_STAGGER } from '../utils';

interface UseCardAnimatedStylesParams {
  index: number;
  reducedMotion: boolean;
}

interface CardAnimationValues {
  cardOpacity: SharedValue<number>;
  cardTranslateY: SharedValue<number>;
  cardTranslateX: SharedValue<number>;
  cardScale: SharedValue<number>;
  successScale: SharedValue<number>;
}

export const useCardAnimatedStyles = ({
  index,
  reducedMotion,
}: UseCardAnimatedStylesParams) => {
  const cardOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const cardTranslateY = useSharedValue(reducedMotion ? 0 : 20);
  const cardTranslateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cardOpacity.value = 1;
      cardTranslateY.value = 0;
      return;
    }

    const delay = index * CARD_ANIMATION_STAGGER;

    cardOpacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CARD_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );

    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
    };
  }, [index, reducedMotion, cardOpacity, cardTranslateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardTranslateY.value },
      { translateX: cardTranslateX.value },
      { scale: cardScale.value },
    ],
  }));

  const successIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const animationValues: CardAnimationValues = {
    cardOpacity,
    cardScale,
    cardTranslateX,
    cardTranslateY,
    successScale,
  };

  return {
    animatedStyle,
    animationValues,
    successIconStyle,
  };
};
