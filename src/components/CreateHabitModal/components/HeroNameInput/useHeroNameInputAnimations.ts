/**
 * useHeroNameInputAnimations Hook
 *
 * Handles validation message animations for HeroNameInput.
 */

import { useState, useEffect } from 'react';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, springs } from '@/theme/animations';
import type { ValidationResult } from './types';

function getValidationMessage(name: string): ValidationResult | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  if (trimmed.length >= 10 && /\d/.test(trimmed)) {
    return {
      message: '✓ Great habit! Specific & achievable 👏',
      type: 'success',
    };
  }

  if (trimmed.length >= 5) {
    return {
      message: '💡 Add a number to make this habit easier to measure',
      type: 'tip',
    };
  }

  return null;
}

export function useHeroNameInputAnimations(value: string) {
  const labelOpacity = useSharedValue(1);
  const validationOpacity = useSharedValue(0);
  const validationTranslateY = useSharedValue(-10);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const newValidation = getValidationMessage(value);

    if (newValidation?.message !== validation?.message) {
      validationOpacity.value = withTiming(
        0,
        { duration: durations.instant },
        (finished) => {
          if (!finished) return;
          scheduleOnRN(setValidation, newValidation);
          if (newValidation) {
            validationTranslateY.value = -10;
            validationOpacity.value = withTiming(1, {
              duration: durations.quick,
            });
            validationTranslateY.value = withSpring(0, springs.standard);
          }
        }
      );
    }
  }, [value, validation?.message, validationOpacity, validationTranslateY]);

  return {
    labelOpacity,
    validation,
    validationOpacity,
    validationTranslateY,
  };
}
