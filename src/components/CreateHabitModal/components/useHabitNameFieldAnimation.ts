/**
 * useHabitNameFieldAnimation - Animation hooks for HabitNameField
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MAX_LENGTH, MAX_CHARS } from './HabitNameField.constants';
import { durations } from '@/theme/animations';

interface UseHabitNameFieldAnimationParams {
  charCount: number;
  isFocused: boolean;
  isError: boolean;
  triggerWarning: () => void;
}

export function useHabitNameFieldAnimation({
  charCount,
  isFocused,
  isError,
  triggerWarning,
}: UseHabitNameFieldAnimationParams) {
  const focusProgress = useSharedValue(0);
  const shakeTranslate = useSharedValue(0);
  const previousCount = useRef(charCount);

  // Update focus animation
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: durations.standard,
    });
  }, [isFocused, focusProgress]);

  // Trigger haptic and shake when exceeding limits
  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    if (charCount > MAX_CHARS && previousCount.current <= MAX_CHARS) {
      triggerWarning();
      shakeTranslate.value = withTiming(
        10,
        { duration: durations.micro },
        () => {
          shakeTranslate.value = withTiming(
            -10,
            { duration: durations.micro },
            () => {
              shakeTranslate.value = withTiming(
                10,
                { duration: durations.micro },
                () => {
                  shakeTranslate.value = withTiming(0, {
                    duration: durations.micro,
                  });
                }
              );
            }
          );
        }
      );
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning, shakeTranslate]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    borderColor:
      focusProgress.value > 0.5 ? '#10B981' : isError ? '#EF4444' : '#e7e5e4',
    borderWidth: 2,
    elevation: focusProgress.value * 2,
    shadowColor: '#10B981',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: focusProgress.value * 0.1,
    shadowRadius: focusProgress.value * 3,
    transform: [{ translateX: shakeTranslate.value }],
  }));

  return { animatedInputStyle };
}

export function useHabitNameFieldFocus() {
  const handleFocus = useCallback(() => true, []);
  const handleBlur = useCallback(() => false, []);
  return { handleBlur, handleFocus };
}
