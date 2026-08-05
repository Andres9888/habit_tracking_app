/** DetailCompleteButton state-transition animation runner (calm fade — no burst/pop). */
import { type SharedValue, withTiming } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';

interface CompleteButtonTransitionParams {
  completionProgress: SharedValue<number>;
  isCompletedToday: boolean;
  isMountTransition: boolean;
  reduceMotion: boolean;
}

export function runCompleteButtonTransition({
  completionProgress,
  isCompletedToday,
  isMountTransition,
  reduceMotion,
}: CompleteButtonTransitionParams): void {
  const target = isCompletedToday ? 1 : 0;

  if (reduceMotion || isMountTransition) {
    completionProgress.value = target;
    return;
  }

  completionProgress.value = withTiming(target, {
    duration: durations.standard,
    easing: enterEasing,
  });
}
