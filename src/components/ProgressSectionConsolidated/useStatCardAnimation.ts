/**
 * useStatCardAnimation - Animation hook for StatCard entrance and press
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Springs } from '../../constants/motion';
import { durations } from '@/theme/animations';
import {
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../utils/animations/cardPressAnimation';

const CARD_STAGGER_DELAY = durations.stagger;
const CARD_ENTRANCE_DURATION = durations.enter;

interface UseStatCardAnimationOptions {
  index: number;
  reduceMotion: boolean;
  isInteractive: boolean;
}

export function useStatCardAnimation({
  index,
  reduceMotion,
  isInteractive,
}: UseStatCardAnimationOptions) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(reduceMotion ? 1 : 0.9);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const delay = index * CARD_STAGGER_DELAY;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CARD_ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    scale.value = withDelay(delay, withSpring(1, Springs.gentle));
  }, [index, reduceMotion, opacity, scale]);

  const handlePressIn = () => {
    if (!isInteractive) return;
    pressScale.value = withSpring(CARD_PRESS_SCALE, Springs.button);
  };

  const handlePressOut = () => {
    if (!isInteractive) return;
    pressScale.value = withSpring(CARD_REST_SCALE, Springs.button);
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pressScale.value }],
  }));

  return { containerStyle, handlePressIn, handlePressOut };
}
