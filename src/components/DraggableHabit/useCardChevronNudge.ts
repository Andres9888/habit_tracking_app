import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface UseCardChevronNudgeParams {
  enabled: boolean;
  reduceMotion: boolean;
}

const NUDGE_PX = 4;
const HALF_CYCLE_MS = 300;
const INITIAL_DELAY_MS = 600;
const EASING = Easing.inOut(Easing.ease);

const nudge = (px: number) =>
  withDelay(
    INITIAL_DELAY_MS,
    withSequence(
      withTiming(px, { duration: HALF_CYCLE_MS, easing: EASING }),
      withTiming(0, { duration: HALF_CYCLE_MS, easing: EASING })
    )
  );

/** One-time mount nudge on the Details pill chevron (first card only). */
export function useCardChevronNudge({
  enabled,
  reduceMotion,
}: UseCardChevronNudgeParams) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    translateX.value = nudge(NUDGE_PX);
  }, [enabled, reduceMotion, translateX]);

  const nudgeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { nudgeStyle };
}
