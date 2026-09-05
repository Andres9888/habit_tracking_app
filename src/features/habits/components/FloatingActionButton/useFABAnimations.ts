import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FAB, RIPPLE_EFFECT } from '../../../../constants';

export function useFABAnimations(
  celebrationsEnabled: boolean,
  reduceMotionPreference: boolean
) {
  const bounce = useSharedValue(0);
  const pressScale = useSharedValue<number>(1);
  const rippleOpacity = useSharedValue<number>(0);
  const rippleScale = useSharedValue<number>(RIPPLE_EFFECT.initialScale);

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      cancelAnimation(bounce);
      bounce.value = 0;
      return;
    }

    bounce.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: FAB.bounceInDuration,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0, {
          duration: FAB.bounceOutDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        withDelay(FAB.initialBounceDelay, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(bounce);
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  return { bounce, pressScale, rippleOpacity, rippleScale };
}
