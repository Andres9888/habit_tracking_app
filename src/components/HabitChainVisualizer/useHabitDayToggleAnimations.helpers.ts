import { Animated } from 'react-native';

import { Motion } from '@/constants/motion';

// Not a motion token: the window that suppresses the forge flash while
// initial completion data hydrates. Coincidentally equal to Motion.duration.breathing.
const HYDRATION_WINDOW_MS = 1500;
const FORGE_FLASH_MS = 500;

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
  /** Mounts / unmounts the overlay. Opacity alone cannot be trusted: it is
   * natively driven, so a dropped native update leaves the cell painted amber
   * with no further value change to repaint it. */
  onActiveChange: (active: boolean) => void;
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
  onActiveChange,
}: ForgeFlashParams): ForgeFlashHandle {
  const isPastHydrationWindow = Date.now() - mountTime > HYDRATION_WINDOW_MS;

  if (!completed || !isPastHydrationWindow) {
    forceValue(forgeFlash, 0);
    onActiveChange(false);
    return { animation: null, safetyTimer: null };
  }

  forgeFlash.setValue(1);
  onActiveChange(true);
  const animation = Animated.timing(forgeFlash, {
    duration: FORGE_FLASH_MS,
    easing: Motion.easing.outCubic,
    toValue: 0,
    useNativeDriver: true,
  });
  let settled = false;
  let safetyTimer: ReturnType<typeof setTimeout> | null = null;
  const settle = () => {
    if (settled) return;
    settled = true;
    if (safetyTimer !== null) clearTimeout(safetyTimer);
    forceValue(forgeFlash, 0);
    onActiveChange(false);
  };
  animation.start(settle);
  // Safety net: if the native-driver animation silently fails or the
  // callback is lost, unmount the amber overlay anyway (fires 100ms after
  // FORGE_FLASH_MS elapses).
  safetyTimer = setTimeout(settle, FORGE_FLASH_MS + 100);

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
          duration: Motion.duration.emphasized,
          easing: Motion.easing.outCubic,
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    : Animated.timing(completion, {
        duration: Motion.duration.base,
        easing: Motion.easing.inEase,
        toValue: 0,
        useNativeDriver: true,
      });
}

export function buildBreathingAnimation(
  breathingPulse: Animated.Value
): Animated.CompositeAnimation {
  const pulse = (toValue: number) =>
    Animated.timing(breathingPulse, {
      duration: Motion.duration.breathing,
      easing: Motion.easing.inOutEase,
      toValue,
      useNativeDriver: true,
    });
  return Animated.loop(Animated.sequence([pulse(1.03), pulse(1)]));
}
