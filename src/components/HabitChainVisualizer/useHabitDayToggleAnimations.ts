import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import {
  buildBreathingAnimation,
  buildCompletionAnimation,
  forceValue,
  startForgeFlash,
} from './useHabitDayToggleAnimations.helpers';
import type { UseHabitDayToggleAnimationsParams } from './useHabitDayToggleAnimations.types';

export const useHabitDayToggleAnimations = ({
  completed,
  isToday,
  dateString,
}: UseHabitDayToggleAnimationsParams) => {
  // Initialize animated values. We use refs to persist across renders.
  // The completion value controls icon opacity and scale.
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;
  // Warm amber "forge" flash that fades out on the false → true transition.
  const forgeFlash = useRef(new Animated.Value(0)).current;
  const prevCompletedRef = useRef<boolean | null>(null);
  const prevDateRef = useRef<string | null>(null);
  const mountTimeRef = useRef(Date.now());

  // Combine scale values using Animated.multiply
  const combinedScale = useMemo(
    () => Animated.multiply(buttonScale, breathingPulse),

    []
  );

  // Snap visuals to the current date's state immediately before paint — with no
  // animation — on first mount AND whenever this position-keyed slot is reused
  // for a different date (week navigation; the chain is keyed by position, not
  // date, so instances persist across weeks). Updating prevCompletedRef here
  // makes the toggle effect below treat the new date as its baseline, so it does
  // not replay a completion / forge-flash animation while you navigate weeks.
  useLayoutEffect(() => {
    if (prevDateRef.current !== dateString) {
      forceValue(completion, completed ? 1 : 0);
      forceValue(forgeFlash, 0);
      prevCompletedRef.current = completed;
      prevDateRef.current = dateString;
    }
  }, [completed, dateString, completion, forgeFlash]);

  useEffect(() => {
    const prevCompleted = prevCompletedRef.current;
    prevCompletedRef.current = completed;

    // On initial mount (prevCompleted is null), value already set by useLayoutEffect
    if (prevCompleted === null) {
      return;
    }

    // After mount, only animate if value actually changed
    if (prevCompleted === completed) {
      return;
    }

    const targetValue = completed ? 1 : 0;

    let cancelled = false;
    const forgeFlashHandle = startForgeFlash({
      completed,
      forgeFlash,
      mountTime: mountTimeRef.current,
    });

    // Value changed - animate the transition
    const animation = buildCompletionAnimation({
      buttonScale,
      completed,
      completion,
    });

    animation.start(({ finished }) => {
      // If the animation was interrupted by something other than our
      // cleanup (e.g., a native driver issue), force the final value
      // so the icon doesn't get stuck invisible
      if (!finished && !cancelled) {
        completion.setValue(targetValue);
      }
    });

    // Safety net: if the native-driver animation silently fails or the
    // callback is lost, force the value after the animation should have
    // completed (300ms > max 220ms animation duration).
    const safetyTimer = setTimeout(() => {
      if (!cancelled) {
        completion.setValue(targetValue);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
      animation.stop();
      if (forgeFlashHandle.safetyTimer !== null) {
        clearTimeout(forgeFlashHandle.safetyTimer);
      }
      if (forgeFlashHandle.animation !== null) {
        forgeFlashHandle.animation.stop();
      }
      forceValue(forgeFlash, 0);
    };
  }, [completed]);

  useEffect(() => {
    if (!completed && isToday) {
      const breathingAnimation = buildBreathingAnimation(breathingPulse);
      breathingAnimation.start();

      return () => {
        breathingAnimation.stop();
      };
    } else {
      breathingPulse.setValue(1);
    }
  }, [completed, isToday]);

  return { buttonScale, combinedScale, completion, forgeFlash };
};
