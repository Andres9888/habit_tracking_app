/**
 * Button animated styles for TemplateScienceModal
 */

import type { SharedValue } from 'react-native-reanimated';

import { useAnimatedStyle } from 'react-native-reanimated';

interface ButtonScaleValues {
  backButtonScale: SharedValue<number>;
  closeButtonScale: SharedValue<number>;
  linkButtonScale: SharedValue<number>;
  shareButtonScale: SharedValue<number>;
  youtubeButtonScale: SharedValue<number>;
}

export const useButtonAnimatedStyles = (values: ButtonScaleValues) => {
  const backButton = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: values.backButtonScale.value ?? 1 }],
    };
  });

  const closeButton = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: values.closeButtonScale.value ?? 1 }],
    };
  });

  const linkButton = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: values.linkButtonScale.value ?? 1 }],
    };
  });

  const shareButton = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: values.shareButtonScale.value ?? 1 }],
    };
  });

  const youtubeButton = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: values.youtubeButtonScale.value ?? 1 }],
    };
  });

  return {
    backButton,
    closeButton,
    linkButton,
    shareButton,
    youtubeButton,
  };
};
