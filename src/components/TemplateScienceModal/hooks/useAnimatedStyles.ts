/**
 * Animated style definitions for TemplateScienceModal
 */

import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { AnimationValues } from './animatedStyles.types';
import { useButtonAnimatedStyles } from './buttonAnimatedStyles';
import { useCardAnimatedStyles } from './cardAnimatedStyles';

export const useAnimatedStyles = (values: AnimationValues) => {
  const hero = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: values.heroOpacity.value ?? 0,
      transform: [
        { scale: values.heroScale.value ?? 1 },
        {
          translateY: interpolate(
            values.scrollY.value ?? 0,
            [0, 200],
            [0, 50],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  const iconGlow = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: values.iconGlowOpacity.value ?? 0,
      transform: [{ scale: values.iconGlowScale.value ?? 1 }],
    };
  });
  const header = useAnimatedStyle(() => {
    'worklet';
    return {
      borderBottomColor:
        interpolate(values.scrollY.value ?? 0, [0, 50], [0, 1]) > 0.5
          ? '#E5E7EB'
          : 'transparent',
    };
  });
  const headerTitle = useAnimatedStyle(() => {
    'worklet';
    const opacity = values.headerTitleOpacity.value ?? 0;
    return {
      opacity,
      transform: [{ scale: interpolate(opacity, [0, 1], [0.9, 1]) }],
    };
  });
  const container = useAnimatedStyle(() => {
    'worklet';
    const dp = values.dismissProgress.value ?? 0;
    return {
      opacity: interpolate(dp, [0, 1], [1, 0.8]),
      transform: [{ translateY: values.translateY.value ?? 0 }],
    };
  });
  const dismissIndicator = useAnimatedStyle(() => {
    'worklet';
    const p = values.dismissProgress.value ?? 0;
    return {
      opacity: p,
      transform: [{ scale: interpolate(p, [0, 1], [0.8, 1]) }],
    };
  });

  return {
    ...useButtonAnimatedStyles(values),
    ...useCardAnimatedStyles(values),
    container,
    dismissIndicator,
    header,
    headerTitle,
    hero,
    iconGlow,
  };
};
