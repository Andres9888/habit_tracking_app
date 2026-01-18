import { useCallback, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useTemplateAnimation = () => {
  const anim = useRef(new Animated.Value(0)).current;

  const chevronRotation = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'] as const,
      }),
    [anim]
  );

  const translateY = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-12, 0],
      }),
    [anim]
  );

  const animateOpen = useCallback(() => {
    anim.stopAnimation();
    Animated.timing(anim, {
      duration: 220,
      easing: Easing.out(Easing.ease),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const animateClose = useCallback((onFinished?: () => void) => {
    anim.stopAnimation();
    Animated.timing(anim, {
      duration: 180,
      easing: Easing.out(Easing.ease),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFinished?.();
    });
  }, [anim]);

  const resetAnimation = useCallback(() => {
    anim.stopAnimation();
    anim.setValue(0);
  }, [anim]);

  return { anim, chevronRotation, translateY, animateOpen, animateClose, resetAnimation };
};
