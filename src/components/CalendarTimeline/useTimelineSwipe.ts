import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const HORIZONTAL_SWIPE_THRESHOLD = 44;
const SWIPE_VELOCITY_THRESHOLD = 450;

interface UseTimelineSwipeProps {
  canNavigateForward: boolean;
  onNextWeek?: () => void;
  onPreviousWeek?: () => void;
}

export function useTimelineSwipe({
  canNavigateForward,
  onNextWeek,
  onPreviousWeek,
}: UseTimelineSwipeProps) {
  const handleTimelineSwipe = useCallback(
    (translationX: number, velocityX: number) => {
      const isSwipeLeft =
        translationX <= -HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX <= -SWIPE_VELOCITY_THRESHOLD;
      if (isSwipeLeft && canNavigateForward) {
        onNextWeek?.();
        return;
      }

      const isSwipeRight =
        translationX >= HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX >= SWIPE_VELOCITY_THRESHOLD;
      if (isSwipeRight) {
        onPreviousWeek?.();
      }
    },
    [canNavigateForward, onNextWeek, onPreviousWeek]
  );

  return useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-18, 18])
        .failOffsetY([-12, 12])
        .onEnd((event) => {
          runOnJS(handleTimelineSwipe)(event.translationX, event.velocityX);
        }),
    [handleTimelineSwipe]
  );
}
