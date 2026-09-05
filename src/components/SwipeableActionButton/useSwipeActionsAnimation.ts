/**
 * Animation + progressive haptic-threshold logic for SwipeActions.
 * Split out of SwipeActions.tsx to keep the component under the
 * repo's 100-line-per-file budget.
 */
import {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { triggerHaptic } from '@/utils/haptics';

export function useSwipeActionsAnimation(dragX: SharedValue<number>) {
  const reduceMotion = useReducedMotion();
  const threshold50Triggered = useSharedValue(false);
  const threshold80Triggered = useSharedValue(false);

  // Progressive haptic feedback at swipe thresholds
  useAnimatedReaction(
    () => dragX.value,
    (value) => {
      if (reduceMotion) return;
      const progress = Math.abs(value) / 120; // 120 is full swipe distance

      // Trigger medium impact at 50%
      if (progress >= 0.5 && !threshold50Triggered.value) {
        threshold50Triggered.value = true;
        scheduleOnRN(triggerHaptic, 'toggle');
      } else if (progress < 0.5) {
        threshold50Triggered.value = false;
      }

      // Trigger heavy impact at 80%
      if (progress >= 0.8 && !threshold80Triggered.value) {
        threshold80Triggered.value = true;
        scheduleOnRN(triggerHaptic, 'heavy');
      } else if (progress < 0.8) {
        threshold80Triggered.value = false;
      }
    },
    [reduceMotion]
  );

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          dragX.value,
          [-120, 0],
          [0, 120],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Progressive icon scale + opacity based on swipe progress
  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      dragX.value,
      [-120, -50, 0],
      [1, 0.85, 0.6],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          dragX.value,
          [-120, -80, -40, 0],
          [1.15, 1.05, 0.9, 0.8],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return { containerStyle, iconStyle };
}
