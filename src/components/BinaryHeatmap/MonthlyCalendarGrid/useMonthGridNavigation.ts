/** Month navigation state + swipe gesture for MonthlyCalendarGrid. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { addMonths, startOfMonth } from 'date-fns';
import { triggerHaptic } from '@/utils/haptics';

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 450;

export function useMonthGridNavigation(
  controlledMonth: Date | undefined,
  onCurrentMonthChange?: (month: Date) => void
) {
  const [internalMonth, setInternalMonth] = useState(() => new Date());
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
    'right'
  );
  const currentMonth = controlledMonth ?? internalMonth;

  useEffect(() => {
    if (controlledMonth) setInternalMonth(controlledMonth);
  }, [controlledMonth]);

  const shiftMonth = useCallback(
    (delta: number) => {
      setSlideDirection(delta > 0 ? 'left' : 'right');
      const base = controlledMonth ?? internalMonth;
      const next = startOfMonth(addMonths(base, delta));
      void triggerHaptic('selection');
      if (onCurrentMonthChange) onCurrentMonthChange(next);
      else setInternalMonth(next);
    },
    [controlledMonth, internalMonth, onCurrentMonthChange]
  );

  const goToPreviousMonth = useCallback(() => {
    shiftMonth(-1);
  }, [shiftMonth]);

  const goToNextMonth = useCallback(() => {
    shiftMonth(1);
  }, [shiftMonth]);

  const monthSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-18, 18])
        .failOffsetY([-20, 20])
        .onEnd((event) => {
          const swipedLeft =
            event.translationX <= -SWIPE_THRESHOLD ||
            event.velocityX <= -VELOCITY_THRESHOLD;
          const swipedRight =
            event.translationX >= SWIPE_THRESHOLD ||
            event.velocityX >= VELOCITY_THRESHOLD;
          if (swipedLeft) runOnJS(shiftMonth)(1);
          else if (swipedRight) runOnJS(shiftMonth)(-1);
        }),
    [shiftMonth]
  );

  return {
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    monthSwipeGesture,
    slideDirection,
  };
}
