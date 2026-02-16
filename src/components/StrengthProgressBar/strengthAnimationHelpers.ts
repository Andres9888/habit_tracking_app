import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

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
      200,
      withTiming(clampedStrength, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
  } else if (isEmptyingTransition) {
    progressWidth.value = withTiming(clampedStrength, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  } else if (isIncreasing) {
    progressWidth.value = withSpring(clampedStrength, {
      damping: 12,
      mass: 0.8,
      stiffness: 80,
    });
  } else {
    progressWidth.value = withTiming(clampedStrength, {
      duration: 300,
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
    emojiOpacity.value = withTiming(0.3, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    emojiScale.value = withTiming(0.6, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    emojiRotation.value = withSequence(
      withTiming(-8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
      withTiming(8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 60, easing: Easing.out(Easing.ease) })
    );
    emojiOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
    );
    emojiScale.value = withDelay(
      150,
      withSequence(
        withSpring(1.4, { damping: 6, stiffness: 120 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      )
    );
  } else {
    emojiScale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.ease) }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
  }
}
