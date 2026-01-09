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
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: props.backdropOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: props.contentOpacity.value,
    transform: [{ translateY: props.contentTranslateY.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: props.iconScale.value }],
  }));

  const iconGlowStyle = useAnimatedStyle(() => ({
    opacity: props.iconGlowOpacity.value,
    transform: [{ scale: props.iconGlowScale.value }],
  }));

  const closeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: props.closeButtonScale.value }],
  }));

  const closeButtonAnimatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: props.closeButtonOpacity.value,
  }));

  const importButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: props.importButtonScale.value }],
  }));

  const customizeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: props.customizeButtonScale.value }],
  }));

  const successGlowStyle = useAnimatedStyle(() => ({
    opacity: props.successGlow.value,
    transform: [{ scale: props.successGlowScale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: props.checkmarkScale.value,
    transform: [
      { scale: props.checkmarkScale.value },
      { rotate: `${Math.round(props.checkmarkRotation.value)}deg` },
    ],
  }));

  const successButtonGlowStyle = useAnimatedStyle(() => ({
    opacity: props.successButtonGlow.value,
  }));

  const successIconBounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: props.successIconBounce.value }],
  }));

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
