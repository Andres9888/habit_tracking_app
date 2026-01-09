import { useRef, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';

import { getStrengthLabel } from './strengthUtils';

export function useStrengthAnimation(
  strengthPercent: number,
  reduceMotionPreference: boolean
) {
  const strengthEmojiScale = useSharedValue(1);
  const strengthEmojiOpacity = useSharedValue(1);
  const strengthEmojiRotation = useSharedValue(0);
  const previousStrengthLevelRef = useRef(getStrengthLabel(strengthPercent));

  useEffect(() => {
    const currentLabel = getStrengthLabel(strengthPercent);
    const levelChanged = previousStrengthLevelRef.current !== currentLabel;
    previousStrengthLevelRef.current = currentLabel;

    if (reduceMotionPreference) return;

    if (levelChanged) {
      runLevelUpAnimation(
        strengthEmojiOpacity,
        strengthEmojiScale,
        strengthEmojiRotation
      );
    } else {
      runSubtlePulse(strengthEmojiScale);
    }
  }, [strengthPercent, reduceMotionPreference]);

  const strengthEmojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: strengthEmojiOpacity.value,
    transform: [
      { scale: strengthEmojiScale.value },
      { rotate: `${Math.round(strengthEmojiRotation.value)}deg` },
    ],
  }));

  return { strengthEmojiAnimatedStyle };
}

function runLevelUpAnimation(
  opacity: { value: number },
  scale: { value: number },
  rotation: { value: number }
) {
  opacity.value = withTiming(0.3, {
    duration: 150,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  scale.value = withTiming(0.6, {
    duration: 150,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  rotation.value = withSequence(
    withTiming(-8, {
      duration: 80,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(8, {
      duration: 80,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(0, {
      duration: 60,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  opacity.value = withDelay(
    150,
    withTiming(1, {
      duration: 200,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  scale.value = withDelay(
    150,
    withSequence(
      withSpring(1.4, { damping: 6, stiffness: 120 }),
      withSpring(1, { damping: 10, stiffness: 180 })
    )
  );
}

function runSubtlePulse(scale: { value: number }) {
  scale.value = withSequence(
    withTiming(1.08, {
      duration: 100,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    }),
    withSpring(1, { damping: 15, stiffness: 200 })
  );
}
