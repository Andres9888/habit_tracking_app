import {
  cancelAnimation,
  Easing,
  type SharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Motion } from '@/constants/motion';
import { durations } from '@/theme/animations';

interface Values {
  breathingScale: SharedValue<number>;
  buttonScale: SharedValue<number>;
  completion: SharedValue<number>;
}

const transitionEasing = Easing.out(Easing.cubic);

export function snapDayToggleAnimations(
  values: Values,
  completed: boolean
) {
  const completionTarget = completed ? 1 : 0;
  for (const value of Object.values(values)) cancelAnimation(value);
  values.breathingScale.value = 1;
  values.buttonScale.value = 1;
  values.completion.value = completionTarget;
}

export function runCompletionTransition({
  completed,
  completion,
  hideIcon,
  reduceMotion,
}: {
  completed: boolean;
  completion: SharedValue<number>;
  hideIcon: () => void;
  reduceMotion: boolean;
}) {
  cancelAnimation(completion);
  completion.value = withTiming(
    completed ? 1 : 0,
    {
      duration: reduceMotion ? durations.stagger : durations.reveal,
      easing: transitionEasing,
    },
    (finished) => {
      if (finished && !completed) scheduleOnRN(hideIcon);
    }
  );
}

export function runBreathingTransition({
  breathingScale,
  reduceMotion,
  shouldBreathe,
}: {
  breathingScale: SharedValue<number>;
  reduceMotion: boolean;
  shouldBreathe: boolean;
}) {
  cancelAnimation(breathingScale);
  if (reduceMotion) {
    breathingScale.value = 1;
    return;
  }
  if (shouldBreathe) {
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.03, {
          duration: Motion.duration.breathing,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: Motion.duration.breathing,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
    return;
  }
  if (breathingScale.value !== 1) {
    breathingScale.value = withTiming(1, {
      duration: durations.reveal,
      easing: transitionEasing,
    });
  }
}
