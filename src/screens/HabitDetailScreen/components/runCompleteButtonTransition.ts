/** DetailCompleteButton state-transition animation runner (calm fade — no burst/pop). */
import {
  type SharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '../../../theme/animations';

interface CompleteButtonTransitionParams {
  checkScale: SharedValue<number>;
  completionProgress: SharedValue<number>;
  isCompletedToday: boolean;
  isMountTransition: boolean;
  reduceMotion: boolean;
}

export function runCompleteButtonTransition({
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
    return;
  }

  completionProgress.value = withTiming(target, {
    duration: durations.standard,
    easing: enterEasing,
  });

  checkScale.value = withTiming(target, {
    duration: durations.quick,
    easing: isCompletedToday ? enterEasing : exitEasing,
  });
}
