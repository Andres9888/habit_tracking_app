/**
 * Animated style definitions for TemplateScienceModal
 */

import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { AnimationValues } from './animatedStyles.types';

export const useAnimatedStyles = (values: AnimationValues) => {
  const hero = useAnimatedStyle(() => ({
    opacity: values.heroOpacity.value,
    transform: [
      { scale: values.heroScale.value },
      {
        translateY: interpolate(
          values.scrollY.value,
          [0, 200],
          [0, 50],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const iconGlow = useAnimatedStyle(() => ({
    opacity: values.iconGlowOpacity.value,
    transform: [{ scale: values.iconGlowScale.value }],
  }));

  const card1 = useAnimatedStyle(() => ({
    opacity: values.card1Progress.value,
    transform: [
      { translateY: interpolate(values.card1Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const card2 = useAnimatedStyle(() => ({
    opacity: values.card2Progress.value,
    transform: [
      { translateY: interpolate(values.card2Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const card3 = useAnimatedStyle(() => ({
    opacity: values.card3Progress.value,
    transform: [
      { translateY: interpolate(values.card3Progress.value, [0, 1], [30, 0]) },
    ],
  }));

  const footer = useAnimatedStyle(() => ({
    opacity: values.footerProgress.value,
    transform: [
      { translateY: interpolate(values.footerProgress.value, [0, 1], [20, 0]) },
    ],
  }));

  const header = useAnimatedStyle(() => ({
    borderBottomColor:
      interpolate(values.scrollY.value, [0, 50], [0, 1]) > 0.5
        ? '#E5E7EB'
        : 'transparent',
  }));

  const headerTitle = useAnimatedStyle(() => ({
    opacity: values.headerTitleOpacity.value,
    transform: [
      { scale: interpolate(values.headerTitleOpacity.value, [0, 1], [0.9, 1]) },
    ],
  }));

  const container = useAnimatedStyle(() => ({
    opacity: interpolate(values.dismissProgress.value, [0, 1], [1, 0.8]),
    transform: [{ translateY: values.translateY.value }],
  }));

  const dismissIndicator = useAnimatedStyle(() => ({
    opacity: values.dismissProgress.value,
    transform: [
      { scale: interpolate(values.dismissProgress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  const backButton = useAnimatedStyle(() => ({
    transform: [{ scale: values.backButtonScale.value }],
  }));
  const closeButton = useAnimatedStyle(() => ({
    transform: [{ scale: values.closeButtonScale.value }],
  }));
  const linkButton = useAnimatedStyle(() => ({
    transform: [{ scale: values.linkButtonScale.value }],
  }));
  const shareButton = useAnimatedStyle(() => ({
    transform: [{ scale: values.shareButtonScale.value }],
  }));
  const youtubeButton = useAnimatedStyle(() => ({
    transform: [{ scale: values.youtubeButtonScale.value }],
  }));

  return {
    backButton,
    card1,
    card2,
    card3,
    closeButton,
    container,
    dismissIndicator,
    footer,
    header,
    headerTitle,
    hero,
    iconGlow,
    linkButton,
    shareButton,
    youtubeButton,
  };
};
