/**
 * Animated styles for FullsizeTemplatePreview
 */

import { useAnimatedStyle } from 'react-native-reanimated';
import type { UseAnimatedStylesProps } from './useAnimatedStyles.types';
import { useSuccessAnimatedStyles } from './successAnimatedStyles';

export type { UseAnimatedStylesProps } from './useAnimatedStyles.types';

export const useAnimatedStyles = (props: UseAnimatedStylesProps) => {
  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: props.backdropOpacity.value ?? 0 };
  });

  const contentStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.contentOpacity.value ?? 0,
      transform: [{ translateY: props.contentTranslateY.value ?? 0 }],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: props.iconScale.value ?? 1 }] };
  });

  const iconGlowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.iconGlowOpacity.value ?? 0,
      transform: [{ scale: props.iconGlowScale.value ?? 1 }],
    };
  });

  const closeButtonStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: props.closeButtonScale.value ?? 1 }] };
  });

  const closeButtonAnimatedOpacityStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: props.closeButtonOpacity.value ?? 0 };
  });

  const customizeButtonStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: props.customizeButtonScale.value ?? 1 }] };
  });

  const successStyles = useSuccessAnimatedStyles(props);

  return {
    backdropStyle,
    closeButtonAnimatedOpacityStyle,
    contentStyle,
    customizeButtonStyle,
    iconAnimatedStyle,
    iconGlowStyle,
    ...successStyles,
  };
};
