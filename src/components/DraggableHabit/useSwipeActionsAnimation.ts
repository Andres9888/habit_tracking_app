/**
 * Animated styles for the DraggableHabit swipe-actions panel.
 * Split out of SwipeActions.tsx to keep the component under the
 * repo's 100-line-per-file budget.
 */
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

export function useSwipeActionsAnimation(dragX: SharedValue<number>) {
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          dragX.value,
          [-160, 0],
          [0, 160],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const archiveIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      dragX.value,
      [-160, -80, 0],
      [1, 0.85, 0.6],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          dragX.value,
          [-160, -100, -60, 0],
          [1.1, 1, 0.85, 0.8],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return { archiveIconStyle, containerStyle };
}
