import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

export function animateProgressWidth(
  progressWidth: SharedValue<number>,
  clampedStrength: number,
  previousStrength: number,
  isFirst: boolean,
  reduceMotion: boolean
) {
  const isEmptyingTransition =
    clampedStrength <= 5 && previousStrength > clampedStrength;
  const isIncreasing = clampedStrength > previousStrength;

  if (reduceMotion) {
    progressWidth.value = clampedStrength;
  } else if (isFirst) {
    progressWidth.value = 0;
    progressWidth.value = withDelay(
      durations.standard,
      withTiming(clampedStrength, {
        duration: durations.progress,
        easing: Easing.out(Easing.cubic),
      })
    );
  } else if (isEmptyingTransition) {
    progressWidth.value = withTiming(clampedStrength, {
      duration: durations.emphasis,
      easing: Easing.out(Easing.cubic),
    });
  } else if (isIncreasing) {
    progressWidth.value = withSpring(clampedStrength, springs.gentle);
  } else {
    progressWidth.value = withTiming(clampedStrength, {
      duration: durations.moderate,
      easing: Easing.out(Easing.quad),
    });
  }
}

export function animateEmoji(
  emojiScale: SharedValue<number>,
  emojiOpacity: SharedValue<number>,
  emojiRotation: SharedValue<number>,
  levelChanged: boolean
) {
  if (levelChanged) {
    // Choreographed with RankEmojiTile cross-fade. Single, soft motion —
    // gentle scale dip + subtle tilt, no wobble, no overshoot. Matches the
    // cubic ease of the big tile so both emojis read as one event.
    const SOFT_EASE = Easing.bezier(0.4, 0, 0.2, 1);
    emojiOpacity.value = withTiming(0.55, {
      duration: durations.quick,
      easing: SOFT_EASE,
    });
    emojiScale.value = withTiming(0.85, {
      duration: durations.quick,
      easing: SOFT_EASE,
    });
    emojiRotation.value = withSequence(
      withTiming(-4, { duration: durations.quick, easing: SOFT_EASE }),
      withTiming(0, { duration: durations.standard, easing: SOFT_EASE })
    );
    emojiOpacity.value = withDelay(
      durations.instant,
      withTiming(1, { duration: durations.transition, easing: SOFT_EASE })
    );
    emojiScale.value = withDelay(
      durations.instant,
      withSequence(
        withTiming(1.1, { duration: durations.quick, easing: SOFT_EASE }),
        withSpring(1, springs.gentle)
      )
    );
  } else {
    emojiScale.value = withSequence(
      withTiming(1.08, {
        duration: durations.instant,
        easing: Easing.out(Easing.ease),
      }),
      withSpring(1, springs.standard)
    );
  }
}
