import {
  runOnJS,
  type SharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';

/** Soft press feedback — no bounce pop. */
const SETTLE_SCALE = 0.97;

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
    fillScale.value = 1;
    fillProgress.value = withTiming(1, {
      duration: durations.quick,
      easing: enterEasing,
    });
    cellPop.value = withSequence(
      withTiming(SETTLE_SCALE, { duration: durations.instant }),
      withTiming(1, { duration: durations.reveal, easing: enterEasing })
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
