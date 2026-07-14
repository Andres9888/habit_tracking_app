// TODO: Migrate from legacy Animated API to react-native-reanimated
// Requires coordinated changes across useFABAnimations, useFABHandlers, and FloatingActionButton
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FAB, RIPPLE_EFFECT } from '../../../../constants';

export const FAB_ATTENTION_CYCLES = 2;

export function useFABAnimations(
  celebrationsEnabled: boolean,
  reduceMotionPreference: boolean
) {
  const bounce = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(
    new Animated.Value(RIPPLE_EFFECT.initialScale)
  ).current;

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      bounce.stopAnimation();
      bounce.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          duration: FAB.bounceInDuration,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          duration: FAB.bounceOutDuration,
          easing: Easing.inOut(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.delay(FAB.initialBounceDelay),
      ]),
      { iterations: FAB_ATTENTION_CYCLES }
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  return { bounce, pressScale, rippleOpacity, rippleScale };
}
