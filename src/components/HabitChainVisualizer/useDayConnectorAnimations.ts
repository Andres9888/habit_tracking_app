import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface UseDayConnectorAnimationsParams {
  visible: boolean;
  shimmerSpeed: number;
}

export const useDayConnectorAnimations = ({
  visible,
  shimmerSpeed,
}: UseDayConnectorAnimationsParams) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: durations.transition,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, opacity]);

  useEffect(() => {
    if (visible && shimmerSpeed > 0) {
      shimmerPosition.value = 0;
      shimmerPosition.value = withRepeat(
        withTiming(1, {
          duration: shimmerSpeed,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(shimmerPosition);
      shimmerPosition.value = 0;
    }
  }, [visible, shimmerSpeed, shimmerPosition]);

  return { opacity, shimmerPosition };
};
