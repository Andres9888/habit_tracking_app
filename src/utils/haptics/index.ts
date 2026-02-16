/**
 * Haptics - Centralized haptic feedback patterns library
 *
 * Created by Opus.
 *
 * @example Imperative (non-hook)
 * ```ts
 * import { triggerHaptic } from '@/utils/haptics';
 * triggerHaptic('tap');
 * ```
 *
 * @example Hook (respects accessibility)
 * ```ts
 * import { useHaptics } from '@/utils/haptics';
 * const { trigger } = useHaptics();
 * trigger('celebration');
 * ```
 */
export { triggerHaptic, triggerHapticAsync } from './haptics';
export { HapticPatterns, type HapticPatternName } from './patterns';
export { useHaptics } from './useHaptics';
