/**
 * Animation hooks for InlineEmojiInput
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Animated } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { MAX_LENGTH, getValidationMessage } from './constants';
import {
  animateEmojiBounce,
  animateValidationChange,
  animateEmojiBoxPressIn,
  animateEmojiBoxPressOut,
} from './animationEffects';
import type { ValidationMessage } from './types';

export function useInputAnimations(value: string, emoji: string | null) {
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const { triggerWarning, triggerSelection } = useHapticFeedback();
  const previousCount = useRef(charCount);

  const validationOpacity = useRef(new Animated.Value(0)).current;
  const validationTranslateY = useRef(new Animated.Value(-10)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiBoxScale = useRef(new Animated.Value(1)).current;

  const [validation, setValidation] = useState<ValidationMessage | null>(null);

  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH)
      triggerWarning();
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  useEffect(() => {
    if (emoji) animateEmojiBounce(emojiScale);
  }, [emoji, emojiScale]);

  useEffect(() => {
    const newValidation = getValidationMessage(value);
    if (newValidation?.message !== validation?.message) {
      animateValidationChange(
        validationOpacity,
        validationTranslateY,
        newValidation,
        setValidation
      );
    }
  }, [value, validation?.message, validationOpacity, validationTranslateY]);

  const handleEmojiBoxPressIn = useCallback(
    () => animateEmojiBoxPressIn(emojiBoxScale),
    [emojiBoxScale]
  );
  const handleEmojiBoxPressOut = useCallback(
    () => animateEmojiBoxPressOut(emojiBoxScale),
    [emojiBoxScale]
  );

  return {
    charCount,
    emojiBoxScale,
    emojiScale,
    handleEmojiBoxPressIn,
    handleEmojiBoxPressOut,
    isNearLimit,
    triggerSelection,
    validation,
    validationOpacity,
    validationTranslateY,
  };
}
