import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { createCelebrationAnimations } from './celebrationAnimations';

interface UseWeeklySummaryAnimationsParams {
  visible: boolean;
  reduceMotion: boolean;
  completionRate: number;
}

export function useWeeklySummaryAnimations({
  visible,
  reduceMotion,
  completionRate,
}: UseWeeklySummaryAnimationsParams) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const starRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      return;
    }
    if (reduceMotion) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }

    const entranceAnim = Animated.parallel([
      Animated.timing(fadeAnim, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        friction: 8,
        tension: 40,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);
    entranceAnim.start();

    let celebrationAnim: Animated.CompositeAnimation | null = null;
    let rotationAnim: Animated.CompositeAnimation | null = null;
    if (completionRate >= 75) {
      const anims = createCelebrationAnimations(celebrationScale, starRotation);
      celebrationAnim = anims.celebrationAnim;
      rotationAnim = anims.rotationAnim;
      celebrationAnim.start();
      rotationAnim.start();
    }

    return () => {
      entranceAnim.stop();
      celebrationAnim?.stop();
      rotationAnim?.stop();
      celebrationScale.setValue(1);
      starRotation.setValue(0);
    };
  }, [
    visible,
    reduceMotion,
    completionRate,
    fadeAnim,
    slideAnim,
    celebrationScale,
    starRotation,
  ]);

  const starRotationInterpolate = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { celebrationScale, fadeAnim, slideAnim, starRotationInterpolate };
}
