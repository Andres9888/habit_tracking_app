/**
 * Animated styles for FullsizeTemplatePreview
 */

import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

interface UseAnimatedStylesProps {
  backdropOpacity: SharedValue<number>;
  contentTranslateY: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  iconGlowScale: SharedValue<number>;
  iconGlowOpacity: SharedValue<number>;
  closeButtonScale: SharedValue<number>;
  closeButtonOpacity: SharedValue<number>;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  successGlow: SharedValue<number>;
  successGlowScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotation: SharedValue<number>;
  successButtonGlow: SharedValue<number>;
  successIconBounce: SharedValue<number>;
}

export const useAnimatedStyles = (props: UseAnimatedStylesProps) => {
  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.backdropOpacity.value ?? 0,
    };
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
    return {
      transform: [{ scale: props.iconScale.value ?? 1 }],
    };
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
    return {
      transform: [{ scale: props.closeButtonScale.value ?? 1 }],
    };
  });

  const closeButtonAnimatedOpacityStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.closeButtonOpacity.value ?? 0,
    };
  });

  const importButtonStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: props.importButtonScale.value ?? 1 }],
    };
  });

  const customizeButtonStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: props.customizeButtonScale.value ?? 1 }],
    };
  });

  const successGlowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.successGlow.value ?? 0,
      transform: [{ scale: props.successGlowScale.value ?? 1 }],
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.checkmarkScale.value ?? 0,
      transform: [
        { scale: props.checkmarkScale.value ?? 0 },
        { rotate: `${Math.round(props.checkmarkRotation.value ?? 0)}deg` },
      ],
    };
  });

  const successButtonGlowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.successButtonGlow.value ?? 0,
    };
  });

  const successIconBounceStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: props.successIconBounce.value ?? 0 }],
    };
  });

  return {
    backdropStyle,
    checkmarkAnimatedStyle,
    closeButtonAnimatedOpacityStyle,
    closeButtonStyle,
    contentStyle,
    customizeButtonStyle,
    iconAnimatedStyle,
    iconGlowStyle,
    importButtonStyle,
    successButtonGlowStyle,
    successGlowStyle,
    successIconBounceStyle,
  };
};
