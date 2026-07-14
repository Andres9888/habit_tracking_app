import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const CONNECTOR_SHIMMER_CYCLES = 2;

interface UseDayConnectorAnimationsParams {
  visible: boolean;
  shimmerSpeed: number;
}

export const useDayConnectorAnimations = ({
  visible,
  shimmerSpeed,
}: UseDayConnectorAnimationsParams) => {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(visible ? 1 : 0);
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, opacity]);

  useEffect(() => {
    if (visible && shimmerSpeed > 0 && !reducedMotion) {
      shimmerPosition.value = 0;
      shimmerPosition.value = withRepeat(
        withTiming(1, {
          duration: shimmerSpeed,
          easing: Easing.inOut(Easing.ease),
        }),
        CONNECTOR_SHIMMER_CYCLES,
        false
      );
    } else {
      cancelAnimation(shimmerPosition);
      shimmerPosition.value = 0;
    }
    return () => cancelAnimation(shimmerPosition);
  }, [visible, shimmerSpeed, shimmerPosition, reducedMotion]);

  return { opacity, shimmerPosition };
};
