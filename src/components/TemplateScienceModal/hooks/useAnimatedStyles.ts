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

  const card1 = useAnimatedStyle(() => {
    'worklet';
    const progress = values.card1Progress.value ?? 0;
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [30, 0]) }],
    };
  });

  const card2 = useAnimatedStyle(() => {
    'worklet';
    const progress = values.card2Progress.value ?? 0;
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [30, 0]) }],
    };
  });

  const card3 = useAnimatedStyle(() => {
    'worklet';
    const progress = values.card3Progress.value ?? 0;
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [30, 0]) }],
    };
  });

  const footer = useAnimatedStyle(() => {
    'worklet';
    const progress = values.footerProgress.value ?? 0;
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [20, 0]) }],
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
    const dismissProgress = values.dismissProgress.value ?? 0;
    return {
      opacity: interpolate(dismissProgress, [0, 1], [1, 0.8]),
      transform: [{ translateY: values.translateY.value ?? 0 }],
    };
  });

  const dismissIndicator = useAnimatedStyle(() => {
    'worklet';
    const progress = values.dismissProgress.value ?? 0;
    return {
      opacity: progress,
      transform: [{ scale: interpolate(progress, [0, 1], [0.8, 1]) }],
    };
  });

  const buttonStyles = useButtonAnimatedStyles(values);

  return {
    ...buttonStyles,
    card1,
    card2,
    card3,
    container,
    dismissIndicator,
    footer,
    header,
    headerTitle,
    hero,
    iconGlow,
  };
};
