
import type { ViewStyle } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { focusRingCompactStyle, focusRingStyle } from './focusRing';
import { useReduceMotion } from '../../hooks/useReduceMotion';

interface UseFocusRingOptions {
  compact?: boolean;
  disabled?: boolean;
}

export function useFocusRing(options: UseFocusRingOptions = {}) {
  const { compact = false, disabled = false } = options;
  const reduceMotion = useReduceMotion();
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  const focusStyle = useMemo((): ViewStyle | undefined => {
    if (!isFocused || disabled) return undefined;

    const base = compact ? focusRingCompactStyle : focusRingStyle;
    if (!reduceMotion) return base;

    return {
      borderColor: base.borderColor,
      borderWidth: base.borderWidth,
    };
  }, [compact, disabled, isFocused, reduceMotion]);

  return {
    focusHandlers: {
      focusable: !disabled,
      onBlur,
      onFocus,
    },
    focusStyle,
    isFocused,
  };
}
