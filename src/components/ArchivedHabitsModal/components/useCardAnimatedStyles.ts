import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import {
  MAX_STAGGER_ITEMS,
  STAGGER,
} from '../../SettingsModal/SettingsContent.constants';

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
  const cardTranslateY = useSharedValue(reducedMotion ? 0 : 12);
  const cardTranslateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cardOpacity.value = 1;
      cardTranslateY.value = 0;
      return;
    }

    const delay = Math.min(index, MAX_STAGGER_ITEMS) * STAGGER;
    const timing = { duration: durations.enter, easing: enterEasing };

    cardOpacity.value = withDelay(delay, withTiming(1, timing));
    cardTranslateY.value = withDelay(delay, withTiming(0, timing));

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
