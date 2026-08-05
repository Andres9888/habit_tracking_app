import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';

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
      const swipedLeft =
        translationX <= -HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX <= -SWIPE_VELOCITY_THRESHOLD;
      if (swipedLeft && canNavigateForward) {
        // Swiping left should reveal the newer week to the right.
        onNextWeek?.();
        return;
      }

      const swipedRight =
        translationX >= HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX >= SWIPE_VELOCITY_THRESHOLD;
      if (swipedRight) {
        // Swiping right should reveal the older week to the left.
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
        .runOnJS(true)
        .onEnd((event) => {
          handleTimelineSwipe(event.translationX, event.velocityX);
        }),
    [handleTimelineSwipe]
  );
}
