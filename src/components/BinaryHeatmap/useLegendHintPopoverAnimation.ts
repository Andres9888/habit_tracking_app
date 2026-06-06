import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { LEGEND_HINT_CARD_WIDTH } from './HeatmapLegendHint.styles';

const ORIGIN_X = LEGEND_HINT_CARD_WIDTH / 2;

export function useLegendHintPopoverAnimation(visible: boolean) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.88);
  const translateY = useSharedValue(-8);
  const reduceMotion = useReduceMotion();
  const enter = { duration: durations.reveal, easing: enterEasing };
  const exit = {
    duration: durations.quick,
    easing: Easing.in(Easing.cubic),
  };

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = visible ? 1 : 0;
      scale.value = 1;
      translateY.value = 0;
      return;
    }
    if (visible) {
      scale.value = 0.88;
      translateY.value = -8;
      opacity.value = withTiming(1, enter);
      scale.value = withTiming(1, enter);
      translateY.value = withTiming(0, enter);
      return;
    }
    opacity.value = withTiming(0, exit);
    scale.value = withTiming(0.94, exit);
    translateY.value = withTiming(-4, exit);
  }, [visible, opacity, scale, translateY, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const s = scale.value ?? 1;
    return {
      opacity: opacity.value ?? 0,
      transform: [
        { translateX: ORIGIN_X * (1 - s) },
        { translateY: translateY.value ?? 0 },
        { scale: s },
      ],
    };
  });

  return animatedStyle;
}
