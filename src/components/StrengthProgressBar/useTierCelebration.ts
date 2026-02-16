/**
 * useTierCelebration Hook
 * Detects when user reaches a new strength tier and triggers celebration.
 * Fires haptic feedback and returns a transient "tier up" state.
 */

import { useEffect, useRef, useState } from 'react';
import { useHaptics } from '@/utils/haptics/useHaptics';
import { getCurrentLevel, type LevelConfig } from './StrengthProgressBar.constants';

interface TierCelebrationState {
  /** Whether a tier-up just occurred (auto-clears after delay) */
  showTierUp: boolean;
  /** The new tier info, if tier-up occurred */
  newTier: LevelConfig | null;
}

/**
 * Monitors strength changes and triggers celebration when user
 * crosses into a higher tier.
 */
export function useTierCelebration(strength: number): TierCelebrationState {
  const { trigger } = useHaptics();
  const previousLevelRef = useRef<LevelConfig>(getCurrentLevel(strength));
  const isFirstRender = useRef(true);
  const [tierUp, setTierUp] = useState<LevelConfig | null>(null);

  useEffect(() => {
    const currentLevel = getCurrentLevel(strength);
    const previousLevel = previousLevelRef.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousLevelRef.current = currentLevel;
      return;
    }

    previousLevelRef.current = currentLevel;

    // Only celebrate when moving to a higher tier
    if (currentLevel.threshold > previousLevel.threshold) {
      setTierUp(currentLevel);
      trigger('celebration');

      // Auto-clear after 3 seconds
      const timer = setTimeout(() => setTierUp(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [strength, trigger]);

  return {
    newTier: tierUp,
    showTierUp: tierUp !== null,
  };
}
