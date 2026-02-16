import { useAnimatedStyle } from 'react-native-reanimated';
import type { UseAnimatedStylesProps } from './useAnimatedStyles.types';

export const useSuccessAnimatedStyles = (props: UseAnimatedStylesProps) => {
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
    return { opacity: props.successButtonGlow.value ?? 0 };
  });

  const successIconBounceStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateY: props.successIconBounce.value ?? 0 }] };
  });

  return {
    checkmarkAnimatedStyle,
    successButtonGlowStyle,
    successGlowStyle,
    successIconBounceStyle,
  };
};
