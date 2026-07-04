import { Animated, Easing } from 'react-native';

import { durations } from '@/theme/animations';

const HYDRATION_WINDOW_MS = 1500;

export function forceValue(animatedValue: Animated.Value, value: number) {
  animatedValue.setValue(value);
  Animated.timing(animatedValue, {
    duration: 0,
    toValue: value,
    useNativeDriver: true,
  }).start();
}

interface ForgeFlashParams {
  completed: boolean;
  forgeFlash: Animated.Value;
  mountTime: number;
}

interface ForgeFlashHandle {
  animation: Animated.CompositeAnimation | null;
  safetyTimer: ReturnType<typeof setTimeout> | null;
}

// Forge flash fires only on user-driven false → true transitions.
// Skip during initial hydration when completion data arrives shortly after mount.
export function startForgeFlash({
  completed,
  forgeFlash,
  mountTime,
}: ForgeFlashParams): ForgeFlashHandle {
  const isPastHydrationWindow = Date.now() - mountTime > HYDRATION_WINDOW_MS;

  if (!completed || !isPastHydrationWindow) {
    forceValue(forgeFlash, 0);
    return { animation: null, safetyTimer: null };
  }

  forgeFlash.setValue(1);
  const animation = Animated.timing(forgeFlash, {
    duration: 500,
    easing: Easing.out(Easing.cubic),
    toValue: 0,
    useNativeDriver: true,
  });
  let cancelled = false;
  animation.start(({ finished }) => {
    if (!finished && !cancelled) {
      forceValue(forgeFlash, 0);
    }
  });
  // Safety net: if the native-driver animation silently fails or the
  // callback is lost, force opacity to 0 so the amber overlay doesn't
  // stay painted on the cell (600ms > 500ms animation duration).
  const safetyTimer = setTimeout(() => {
    cancelled = true;
    forceValue(forgeFlash, 0);
  }, 600);

  return { animation, safetyTimer };
}

interface CompletionAnimationParams {
  buttonScale: Animated.Value;
  completed: boolean;
  completion: Animated.Value;
}

export function buildCompletionAnimation({
  buttonScale,
  completed,
  completion,
}: CompletionAnimationParams): Animated.CompositeAnimation {
  return completed
    ? Animated.parallel([
        Animated.spring(buttonScale, {
          friction: 6,
          tension: 300,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(completion, {
          duration: durations.transition,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    : Animated.timing(completion, {
        duration: durations.quick,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      });
}

export function buildBreathingAnimation(
  breathingPulse: Animated.Value
): Animated.CompositeAnimation {
  const pulse = (toValue: number) =>
    Animated.timing(breathingPulse, {
      duration: durations.breathing,
      easing: Easing.inOut(Easing.ease),
      toValue,
      useNativeDriver: true,
    });
  return Animated.loop(Animated.sequence([pulse(1.03), pulse(1)]));
}
