
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

interface UseDayConnectorAnimationsParams {
  visible: boolean;
  shimmerSpeed: number;
}

export const useDayConnectorAnimations = ({
  visible,
  shimmerSpeed,
}: UseDayConnectorAnimationsParams) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const shimmerPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const opacityAnimation = Animated.timing(opacity, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });
    opacityAnimation.start();

    return () => {
      opacityAnimation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (visible && shimmerSpeed > 0) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerPosition, {
            duration: shimmerSpeed,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerPosition, {
            duration: 0,
            toValue: 0,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    } else {
      shimmerPosition.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, shimmerSpeed]);

  return { opacity, shimmerPosition };
};
