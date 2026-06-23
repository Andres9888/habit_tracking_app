/**
 * useCelebration Hook
 *
 * Provides a simple interface to trigger celebration effects
 * with different burst types.
 */

import { useState, useCallback } from 'react';

import type { BurstType } from '../confetti/types';

export interface UseCelebrationOptions {
  /** Whether reduced motion is preferred */
  shouldReduceMotion?: boolean;

  /** Whether dark mode is active */
  isDarkMode?: boolean;

  /** Whether sound effects are enabled */
  soundEnabled?: boolean;

  /** Whether haptic feedback is enabled */
  hapticsEnabled?: boolean;

  /** Optional origin point for celebrations */
  origin?: {
    x: number;
    y: number;
  };
}

interface CelebrationState {
  /** Currently active burst type */
  burstType: BurstType | null;

  /** Key for forcing re-renders */
  key: number;
}

/**
 * Hook for managing celebration effects
 *
 * @example
 * ```tsx
 * const { triggerCelebration, activeBurst } = useCelebration({
 *   soundEnabled: true,
 *   hapticsEnabled: true,
 * });
 *
 * // Trigger a streak milestone celebration
 * triggerCelebration('streakMilestone');
 *
 * // Render the celebration component
 * {activeBurst && (
 *   <ConfettiSystem
 *     burstType={activeBurst}
 *     shouldReduceMotion={false}
 *     isDarkMode={isDark}
 *   />
 * )}
 * ```
 */
export function useCelebration({
  shouldReduceMotion = false,
  isDarkMode = false,
  soundEnabled = false,
  hapticsEnabled = true,
  origin,
}: UseCelebrationOptions = {}) {
  const [celebration, setCelebration] = useState<CelebrationState>({
    burstType: null,
    key: 0,
  });

  /**
   * Trigger a celebration effect
   */
  const triggerCelebration = useCallback(
    (burstType: BurstType) => {
      if (shouldReduceMotion) {
        // Still update state but won't render confetti
        setCelebration((prev) => ({
          burstType,
          key: prev.key + 1,
        }));
        return;
      }

      setCelebration((prev) => ({
        burstType,
        key: prev.key + 1,
      }));
    },
    [shouldReduceMotion]
  );

  /**
   * Clear the active celebration
   */
  const clearCelebration = useCallback(() => {
    setCelebration((prev) => ({
      burstType: null,
      key: prev.key + 1,
    }));
  }, []);

  /**
   * Auto-clear celebration after duration
   */
  const triggerAutoClear = useCallback(
    (duration: number = 3000) => {
      setTimeout(() => {
        clearCelebration();
      }, duration);
    },
    [clearCelebration]
  );

  return {
    /** Active burst type (null if none) */
    activeBurst: celebration.burstType,

    /** Unique key for forcing re-renders */
    celebrationKey: celebration.key,

    /** Trigger a celebration */
    triggerCelebration,

    /** Clear the active celebration */
    clearCelebration,

    /** Trigger celebration and auto-clear after duration */
    triggerAutoClear,

    /** Config for passing to ConfettiSystem */
    config: {
      soundEnabled,
      hapticsEnabled,
      origin,
    },
  };
}
