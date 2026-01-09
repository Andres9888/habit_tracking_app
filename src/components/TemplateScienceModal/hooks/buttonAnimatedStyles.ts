/**
 * Button animated styles for TemplateScienceModal
 */

import { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

interface ButtonScaleValues {
  backButtonScale: SharedValue<number>;
  closeButtonScale: SharedValue<number>;
  linkButtonScale: SharedValue<number>;
  shareButtonScale: SharedValue<number>;
  youtubeButtonScale: SharedValue<number>;
}

export const useButtonAnimatedStyles = (values: ButtonScaleValues) => {
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
    closeButton,
    linkButton,
    shareButton,
    youtubeButton,
  };
};
