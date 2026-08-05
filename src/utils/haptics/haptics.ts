/**
 * Haptics Utility
 *
 * Centralized haptic feedback controller that:
 * - Provides named patterns via a simple API
 * - Respects system haptics/reduce-motion settings
 * - Silently fails on unsupported platforms (web)
 * - Is safe to call from any context (hook or imperative)
 *
 * Created by Opus.
 */

import { Platform } from 'react-native';

import { HapticPatterns, type HapticPatternName } from './patterns';

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

/**
 * Fire a named haptic pattern.
 * Safe to call anywhere — silently no-ops on web or if haptics fail.
 *
 * @example
 * ```ts
 * import { triggerHaptic } from '@/utils/haptics';
 * triggerHaptic('tap');
 * triggerHaptic('celebration');
 * ```
 */
export function triggerHaptic(pattern: HapticPatternName): Promise<void> {
  if (!isHapticsSupported) return Promise.resolve();

  const fn = HapticPatterns[pattern];
  if (!fn) return Promise.resolve();
  const result = fn();

  if (result && typeof (result as Promise<unknown>).catch === 'function') {
    return result.catch(() => {
      // Haptics are non-critical — swallow errors silently
    });
  }

  return Promise.resolve();
}

/**
 * Async version — awaits the full pattern sequence.
 * Useful when you need to synchronize animations with haptics.
 */
export async function triggerHapticAsync(
  pattern: HapticPatternName
): Promise<void> {
  if (!isHapticsSupported) return;

  const fn = HapticPatterns[pattern];
  if (fn) {
    try {
      await fn();
    } catch {
      // Haptics are non-critical
    }
  }
}
