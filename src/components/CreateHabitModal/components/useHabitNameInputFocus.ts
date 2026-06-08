import { useEffect, useRef } from 'react';
import type { ComponentRef } from 'react';
import { TextInput } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { createHabitMotion } from '../createHabitMotion';

/** Focus after the full-screen modal enter animation — matches modal slide timing. */
export function useHabitNameInputFocus(shouldFocus: boolean) {
  const reduceMotion = useReduceMotion();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (!shouldFocus) return;

    const focus = () => inputRef.current?.focus();
    if (reduceMotion) {
      focus();
      return;
    }

    const timeout = setTimeout(focus, createHabitMotion.focusAfterEnterMs);
    return () => clearTimeout(timeout);
  }, [reduceMotion, shouldFocus]);

  return inputRef;
}
