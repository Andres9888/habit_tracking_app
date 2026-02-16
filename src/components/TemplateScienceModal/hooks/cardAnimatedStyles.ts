import { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import type { AnimationValues } from './animatedStyles.types';

export const useCardAnimatedStyles = (values: AnimationValues) => {
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
  return { card1, card2, card3, footer };
};
