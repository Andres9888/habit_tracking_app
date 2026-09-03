import {
  cancelAnimation,
  Easing,
  type SharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { durations } from '@/theme/animations';

interface Values {
  buttonScale: SharedValue<number>;
  completion: SharedValue<number>;
}

const transitionEasing = Easing.out(Easing.cubic);

export function snapDayToggleAnimations(values: Values, completed: boolean) {
  const completionTarget = completed ? 1 : 0;
  for (const value of Object.values(values)) cancelAnimation(value);
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
  // A completed checkbox is a state confirmation, so render it atomically.
  // Fading from empty can otherwise leave a gray frame with a ghosted icon
  // when the UI thread is busy. Unchecking may still fade out gracefully.
  if (completed) {
    completion.value = 1;
    return;
  }
  completion.value = withTiming(
    0,
    {
      duration: reduceMotion ? durations.stagger : durations.reveal,
      easing: transitionEasing,
    },
    (finished) => {
      if (finished) scheduleOnRN(hideIcon);
    }
  );
}
