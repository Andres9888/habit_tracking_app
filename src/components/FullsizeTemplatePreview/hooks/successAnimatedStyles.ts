import { useAnimatedStyle } from 'react-native-reanimated';
import type { UseAnimatedStylesProps } from './useAnimatedStyles.types';

/** Points the post-add panel travels upward as it fades in. */
const SUCCESS_PANEL_RISE = 8;

export const useSuccessAnimatedStyles = (props: UseAnimatedStylesProps) => {
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: props.checkmarkScale.value ?? 0,
      transform: [{ scale: props.checkmarkScale.value ?? 0 }],
    };
  });

  // Fade + rise only. A scale here would resample the panel's text; see
  // useSuccessAnimations for why that is not an option on this surface.
  const successPillStyle = useAnimatedStyle(() => {
    'worklet';
    const progress = props.successPanelProgress.value ?? 1;
    return {
      opacity: progress,
      transform: [{ translateY: (1 - progress) * SUCCESS_PANEL_RISE }],
    };
  });

  return {
    checkmarkAnimatedStyle,
    successPillStyle,
  };
};
