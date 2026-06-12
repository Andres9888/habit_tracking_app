import {
  runOnJS,
  type SharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, exitEasing, springs } from '@/theme/animations';

/** Punchy but contained — ~4px growth on a 36px cell. */
const COMPLETE_POP_SCALE = 1.12;

interface FillTransitionParams {
  cellPop: SharedValue<number>;
  fillProgress: SharedValue<number>;
  fillScale: SharedValue<number>;
  hideFill: () => void;
  reduceMotion: boolean;
  setFillMounted: (mounted: boolean) => void;
  showCompleted: boolean;
  wasCompleted: boolean;
}

export function runCalendarDayFillTransition({
  cellPop,
  fillProgress,
  fillScale,
  hideFill,
  reduceMotion,
  setFillMounted,
  showCompleted,
  wasCompleted,
}: FillTransitionParams): void {
  if (showCompleted && !wasCompleted) {
    setFillMounted(true);
    if (reduceMotion) {
      fillScale.value = 1;
      fillProgress.value = 1;
      cellPop.value = 1;
      return;
    }
    fillScale.value = 0;
    fillScale.value = withSpring(1, springs.celebration);
    // Timing (not spring) so interpolateColor never overshoots past the endpoint.
    fillProgress.value = withTiming(1, {
      duration: durations.standard,
      easing: enterEasing,
    });
    cellPop.value = withSequence(
      withSpring(COMPLETE_POP_SCALE, springs.pop),
      withSpring(1, springs.settle)
    );
    return;
  }

  if (!showCompleted && wasCompleted) {
    if (reduceMotion) {
      fillScale.value = 0;
      fillProgress.value = 0;
      cellPop.value = 1;
      setFillMounted(false);
      return;
    }
    fillScale.value = withTiming(
      0,
      { duration: durations.quick, easing: exitEasing },
      (finished) => {
        if (finished) runOnJS(hideFill)();
      }
    );
    fillProgress.value = withTiming(0, {
      duration: durations.quick,
      easing: exitEasing,
    });
    cellPop.value = 1;
  }
}
