import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface UseSwipeHintParams {
  reduceMotion: boolean;
  canNavigateForward: boolean;
}

const NUDGE_PX = 6;
const HALF_CYCLE_MS = durations.moderate;
const INITIAL_DELAY_MS = durations.complex;
const EASING = Easing.inOut(Easing.ease);

const nudge = (px: number) =>
  withDelay(
    INITIAL_DELAY_MS,
    withSequence(
      withTiming(px, { duration: HALF_CYCLE_MS, easing: EASING }),
      withTiming(0, { duration: HALF_CYCLE_MS, easing: EASING })
    )
  );

/**
 * One-time mount nudge on the swipe-hint chevrons.
 * Left arrow nudges rightward (inward), right nudges leftward.
 * No-ops when reduceMotion is true.
 */
export function useSwipeHint({
  reduceMotion,
  canNavigateForward,
}: UseSwipeHintParams) {
  const leftTx = useSharedValue(0);
  const rightTx = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    leftTx.value = nudge(NUDGE_PX);
    if (canNavigateForward) {
      rightTx.value = nudge(-NUDGE_PX);
    }
  }, [reduceMotion, canNavigateForward, leftTx, rightTx]);

  const leftHintStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftTx.value }],
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightTx.value }],
  }));

  return { leftHintStyle, rightHintStyle };
}
