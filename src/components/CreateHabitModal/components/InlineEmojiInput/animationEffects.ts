/**
 * Animation effect helpers for InlineEmojiInput
 */

import { Animated } from 'react-native';
import { Motion } from '../../../../constants/motion';
import type { ValidationMessage } from './types';

export function animateEmojiBounce(emojiScale: Animated.Value): void {
  Animated.sequence([
    Animated.spring(emojiScale, {
      damping: 8,
      stiffness: 300,
      toValue: 1.2,
      useNativeDriver: true,
    }),
    Animated.spring(emojiScale, {
      damping: 8,
      stiffness: 300,
      toValue: 1,
      useNativeDriver: true,
    }),
  ]).start();
}

export function animateValidationIn(
  validationOpacity: Animated.Value,
  validationTranslateY: Animated.Value
): void {
  validationTranslateY.setValue(-10);
  Animated.parallel([
    Animated.timing(validationOpacity, {
      duration: Motion.duration.base,
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.spring(validationTranslateY, {
      damping: 15,
      stiffness: 200,
      toValue: 0,
      useNativeDriver: true,
    }),
  ]).start();
}

export function animateValidationChange(
  validationOpacity: Animated.Value,
  validationTranslateY: Animated.Value,
  newValidation: ValidationMessage | null,
  setValidation: (v: ValidationMessage | null) => void
): void {
  Animated.timing(validationOpacity, {
    duration: Motion.duration.fast,
    toValue: 0,
    useNativeDriver: true,
  }).start(() => {
    setValidation(newValidation);
    if (newValidation) {
      animateValidationIn(validationOpacity, validationTranslateY);
    }
  });
}

export function animateEmojiBoxPressIn(emojiBoxScale: Animated.Value): void {
  Animated.timing(emojiBoxScale, {
    duration: Motion.duration.fast,
    toValue: 0.92,
    useNativeDriver: true,
  }).start();
}

export function animateEmojiBoxPressOut(emojiBoxScale: Animated.Value): void {
  Animated.spring(emojiBoxScale, {
    damping: 12,
    stiffness: 200,
    toValue: 1,
    useNativeDriver: true,
  }).start();
}
