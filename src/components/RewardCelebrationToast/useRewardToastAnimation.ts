import { useEffect, useRef } from 'react';
import { Animated, Easing, AccessibilityInfo } from 'react-native';
import { useState } from 'react';

interface UseRewardToastAnimationProps {
  visible: boolean;
}

export function useRewardToastAnimation({
  visible,
}: UseRewardToastAnimationProps) {
  const translateY = useRef(new Animated.Value(160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check accessibility preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      if (reduceMotion) {
        // Instant appearance for reduce motion
        translateY.setValue(0);
        opacity.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(translateY, {
          duration: 280,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 220,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (reduceMotion) {
      // Instant disappearance for reduce motion
      translateY.setValue(160);
      opacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
        toValue: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 180,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible, reduceMotion]);

  return { opacity, translateY };
}
