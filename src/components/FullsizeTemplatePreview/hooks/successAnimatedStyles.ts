import { useAnimatedStyle } from 'react-native-reanimated';
import type { UseAnimatedStylesProps } from './useAnimatedStyles.types';

export const useSuccessAnimatedStyles = (props: UseAnimatedStylesProps) => {
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.checkmarkScale.value ?? 0,
      transform: [{ scale: props.checkmarkScale.value ?? 0 }],
    };
  });

  const successPillStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: props.successPillScale.value ?? 1 }] };
  });

  return {
    checkmarkAnimatedStyle,
    successPillStyle,
  };
};
