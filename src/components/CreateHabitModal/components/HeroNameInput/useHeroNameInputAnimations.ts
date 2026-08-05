/**
 * useHeroNameInputAnimations Hook
 *
 * Handles validation message animations for HeroNameInput.
 */

import { useRef, useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { springs } from '@/theme/animations';
import { Motion } from '../../../../constants/motion';
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
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const validationOpacity = useRef(new Animated.Value(0)).current;
  const validationTranslateY = useRef(new Animated.Value(-10)).current;
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const newValidation = getValidationMessage(value);

    if (newValidation?.message !== validation?.message) {
      Animated.timing(validationOpacity, {
        duration: Motion.duration.fast,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setValidation(newValidation);
        if (newValidation) {
          validationTranslateY.setValue(-10);
          Animated.parallel([
            Animated.timing(validationOpacity, {
              duration: Motion.duration.base,
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(validationTranslateY, {
              ...springs.standard,
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });
    }
  }, [value, validation?.message, validationOpacity, validationTranslateY]);

  return {
    labelOpacity,
    validation,
    validationOpacity,
    validationTranslateY,
  };
}
