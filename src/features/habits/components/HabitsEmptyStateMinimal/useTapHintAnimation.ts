/**
 * useTapHintAnimation - Pulsing animation for "Tap anywhere to continue"
 *
 * Creates a subtle pulse effect to draw attention to the hint text.
 */

import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

import { TAP_HINT_PULSE } from './animations';

interface UseTapHintAnimationParams {
  shouldReduceMotion: boolean | null;
  autoTransition: boolean;
}

export function useTapHintAnimation({
  shouldReduceMotion,
  autoTransition,
}: UseTapHintAnimationParams) {
  const tapHintOpacity = useSharedValue<number>(0);
  const tapHintScale = useSharedValue<number>(TAP_HINT_PULSE.minScale);

  useEffect(() => {
    if (!autoTransition) return;

    if (shouldReduceMotion) {
      tapHintOpacity.value = withDelay(
        800,
        withTiming(TAP_HINT_PULSE.maxOpacity, { duration: 300 })
      );
      tapHintScale.value = TAP_HINT_PULSE.minScale;
      return;
    }

    tapHintOpacity.value = withDelay(
      800,
      withSequence(
        withTiming(TAP_HINT_PULSE.maxOpacity, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }),
        withRepeat(
          withSequence(
            withTiming(TAP_HINT_PULSE.minOpacity, {
              duration: TAP_HINT_PULSE.duration / 2,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(TAP_HINT_PULSE.maxOpacity, {
              duration: TAP_HINT_PULSE.duration / 2,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          false
        )
      )
    );

    tapHintScale.value = withDelay(
      1100,
      withRepeat(
        withSequence(
          withTiming(TAP_HINT_PULSE.maxScale, {
            duration: TAP_HINT_PULSE.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(TAP_HINT_PULSE.minScale, {
            duration: TAP_HINT_PULSE.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(tapHintOpacity);
      cancelAnimation(tapHintScale);
    };
  }, [autoTransition, shouldReduceMotion, tapHintOpacity, tapHintScale]);

  const tapHintStyle = useAnimatedStyle(() => ({
    opacity: tapHintOpacity.value,
    transform: [{ scale: tapHintScale.value }],
  }));

  return { tapHintStyle };
}
