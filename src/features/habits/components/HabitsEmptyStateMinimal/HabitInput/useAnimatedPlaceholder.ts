/**
 * useAnimatedPlaceholder - Cycles through example habits with fade animation
 *
 * Displays rotating placeholder text that fades between examples.
 * Pauses when user has typed input. Uses time-based examples matching chips.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useReducedMotion,
  runOnJS,
} from 'react-native-reanimated';

import { PLACEHOLDER_TIMING } from '../placeholderConstants';
import { getTimeBasedPlaceholders } from '../utils';

interface UseAnimatedPlaceholderParams {
  /** Current input value — cycling pauses when non-empty */
  inputValue: string;
}

export function useAnimatedPlaceholder({
  inputValue,
}: UseAnimatedPlaceholderParams) {
  const placeholders = getTimeBasedPlaceholders();
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(placeholders[0]);
  const opacity = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isActive = inputValue.length === 0;

  const advanceToNext = useCallback(() => {
    setCurrentIndex((previous) => {
      const next = (previous + 1) % placeholders.length;
      setDisplayText(placeholders[next]);
      return next;
    });
  }, [placeholders]);

  const fadeToNext = useCallback(() => {
    if (shouldReduceMotion) {
      advanceToNext();
      return;
    }

    // Fade out → swap text → fade in
    opacity.value = withTiming(0, {
      duration: PLACEHOLDER_TIMING.fadeDuration,
    });

    timerRef.current = setTimeout(() => {
      runOnJS(advanceToNext)();
      opacity.value = withTiming(1, {
        duration: PLACEHOLDER_TIMING.fadeDuration,
      });
    }, PLACEHOLDER_TIMING.fadeDuration);
  }, [advanceToNext, opacity, shouldReduceMotion]);

  // Cycling interval
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(
      fadeToNext,
      PLACEHOLDER_TIMING.displayDuration
    );

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, fadeToNext]);

  // Reset to full opacity when becoming active again
  useEffect(() => {
    if (isActive) {
      opacity.value = 1;
      setCurrentIndex(0);
      setDisplayText(placeholders[0]);
    }
  }, [isActive, opacity, placeholders]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    displayText,
    isActive,
  };
}
