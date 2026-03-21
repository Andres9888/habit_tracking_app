/**
 * useHaptics Hook
 *
 * React hook wrapper around the haptics utility that respects
 * system reduce-motion preferences and enabled state.
 *
 * Created by Opus.
 */

import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { HapticPatterns, type HapticPatternName } from './patterns';

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

interface UseHapticsOptions {
  /** Override to disable haptics regardless of system setting. */
  enabled?: boolean;
  /** Force reduce-motion preference (overrides system). */
  preference?: boolean;
}

const noopTrigger = (_pattern: HapticPatternName) => {};
const noopTriggerAsync = async (_pattern: HapticPatternName) => {};

/**
 * Returns a `trigger` function that fires named haptic patterns,
 * respecting system accessibility settings.
 *
 * @example
 * ```tsx
 * const { trigger } = useHaptics();
 * <Pressable onPress={() => { trigger('tap'); doSomething(); }} />
 * ```
 */
export function useHaptics({
  enabled = true,
  preference,
}: UseHapticsOptions = {}) {
  const reduceMotion = useReduceMotion({ preference });
  const active = enabled && !reduceMotion && isHapticsSupported;

  const trigger = useCallback(
    (pattern: HapticPatternName) => {
      if (!active) return;
      const fn = HapticPatterns[pattern];
      if (fn) {
        const result = fn();
        if (result && typeof (result as Promise<unknown>).catch === 'function') {
          result.catch(() => {});
        }
      }
    },
    [active]
  );

  const triggerAsync = useCallback(
    async (pattern: HapticPatternName) => {
      if (!active) return;
      const fn = HapticPatterns[pattern];
      if (fn) {
        try {
          await fn();
        } catch {
          // Haptics are non-critical
        }
      }
    },
    [active]
  );

  return useMemo(
    () =>
      active
        ? { isActive: true as const, trigger, triggerAsync }
        : {
            isActive: false as const,
            trigger: noopTrigger,
            triggerAsync: noopTriggerAsync,
          },
    [active, trigger, triggerAsync]
  );
}

export default useHaptics;
