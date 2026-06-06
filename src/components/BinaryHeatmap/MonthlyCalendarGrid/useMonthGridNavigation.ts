/* eslint-disable max-lines */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { addMonths, isAfter, isBefore, startOfMonth } from 'date-fns';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing, springs } from '@/theme/animations';

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 450;
/** How far a tapped chevron "kicks" the sheet before it settles back. */
const BUTTON_KICK = 28;
const SWAP_OPACITY = 0.55;
const FADE_IN = { duration: durations.enter, easing: enterEasing };

export function useMonthGridNavigation(
  controlledMonth: Date | undefined,
  onCurrentMonthChange?: (month: Date) => void,
  minMonth?: Date,
  maxMonth?: Date
) {
  const [internalMonth, setInternalMonth] = useState(new Date());
  const currentMonth = controlledMonth ?? internalMonth;
  const directionRef = useRef<'left' | 'right'>('right');
  const dragX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (controlledMonth) setInternalMonth(controlledMonth);
  }, [controlledMonth]);

  const isWithinBounds = useCallback(
    (month: Date) => {
      const normalized = startOfMonth(month);
      if (minMonth && isBefore(normalized, startOfMonth(minMonth)))
        return false;
      if (maxMonth && isAfter(normalized, startOfMonth(maxMonth))) return false;
      return true;
    },
    [minMonth, maxMonth]
  );

  const shiftMonth = useCallback(
    (delta: number) => {
      directionRef.current = delta > 0 ? 'left' : 'right';
      const base = controlledMonth ?? internalMonth;
      const next = startOfMonth(addMonths(base, delta));
      if (!isWithinBounds(next)) return false;
      void triggerHaptic('selection');
      if (onCurrentMonthChange) onCurrentMonthChange(next);
      else setInternalMonth(next);
      return true;
    },
    [controlledMonth, internalMonth, isWithinBounds, onCurrentMonthChange]
  );

  // Chevron taps replay the same physical settle the swipe ends with.
  const animateFrom = useCallback(
    (offset: number) => {
      dragX.value = offset;
      opacity.value = SWAP_OPACITY;
      dragX.value = withSpring(0, springs.gesture);
      opacity.value = withTiming(1, FADE_IN);
    },
    [dragX, opacity]
  );

  const goToPreviousMonth = useCallback(() => {
    if (shiftMonth(-1)) animateFrom(BUTTON_KICK);
  }, [shiftMonth, animateFrom]);

  const goToNextMonth = useCallback(() => {
    if (shiftMonth(1)) animateFrom(-BUTTON_KICK);
  }, [shiftMonth, animateFrom]);

  const goToMonth = useCallback(
    (month: Date) => {
      const base = controlledMonth ?? internalMonth;
      directionRef.current = month > base ? 'left' : 'right';
      const next = startOfMonth(month);
      if (!isWithinBounds(next)) return;
      void triggerHaptic('selection');
      if (onCurrentMonthChange) onCurrentMonthChange(next);
      else setInternalMonth(next);
      // Picker jumps: clean fade in place, no directional "kick" (overshoot).
      animateFrom(0);
    },
    [
      controlledMonth,
      internalMonth,
      isWithinBounds,
      onCurrentMonthChange,
      animateFrom,
    ]
  );

  const canGoPreviousMonth = isWithinBounds(addMonths(currentMonth, -1));
  const canGoNextMonth = isWithinBounds(addMonths(currentMonth, 1));

  const monthSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-18, 18])
        .failOffsetY([-20, 20])
        .onUpdate((event) => {
          dragX.value = event.translationX;
        })
        .onEnd((event) => {
          const left =
            event.translationX <= -SWIPE_THRESHOLD ||
            event.velocityX <= -VELOCITY_THRESHOLD;
          const right =
            event.translationX >= SWIPE_THRESHOLD ||
            event.velocityX >= VELOCITY_THRESHOLD;
          if (left) {
            runOnJS(shiftMonth)(1);
            opacity.value = SWAP_OPACITY;
          } else if (right) {
            runOnJS(shiftMonth)(-1);
            opacity.value = SWAP_OPACITY;
          }
          dragX.value = withSpring(0, springs.gesture);
          opacity.value = withTiming(1, FADE_IN);
        }),
    [shiftMonth, dragX, opacity]
  );

  const gridAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: dragX.value }],
  }));

  return {
    canGoNextMonth,
    canGoPreviousMonth,
    currentMonth,
    directionRef,
    goToMonth,
    goToNextMonth,
    goToPreviousMonth,
    gridAnimatedStyle,
    monthSwipeGesture,
  };
}
