/** DetailCompleteButton state-transition animation runner. */
import {
  type SharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, springs } from '../../../theme/animations';

/** Subtle full-button lift on completion. */
const BUTTON_POP_SCALE = 1.03;

interface CompleteButtonTransitionParams {
  burstProgress: SharedValue<number>;
  buttonPop: SharedValue<number>;
  checkScale: SharedValue<number>;
  completionProgress: SharedValue<number>;
  isCompletedToday: boolean;
  isMountTransition: boolean;
  reduceMotion: boolean;
}

export function runCompleteButtonTransition({
  burstProgress,
  buttonPop,
  checkScale,
  completionProgress,
  isCompletedToday,
  isMountTransition,
  reduceMotion,
}: CompleteButtonTransitionParams): void {
  const target = isCompletedToday ? 1 : 0;

  if (reduceMotion || isMountTransition) {
    completionProgress.value = target;
    checkScale.value = target;
    buttonPop.value = 1;
    burstProgress.value = 0;
    return;
  }

  completionProgress.value = withTiming(target, {
    duration: durations.standard,
    easing: enterEasing,
  });

  if (isCompletedToday) {
    checkScale.value = 0;
    checkScale.value = withSpring(1, springs.celebration);
    buttonPop.value = withSequence(
      withSpring(BUTTON_POP_SCALE, springs.pulse),
      withSpring(1, springs.settle)
    );
    burstProgress.value = 0;
    burstProgress.value = withTiming(1, {
      duration: durations.emphasis,
      easing: enterEasing,
    });
  } else {
    checkScale.value = withTiming(0, { duration: durations.quick });
    buttonPop.value = 1;
    burstProgress.value = 0;
  }
}
