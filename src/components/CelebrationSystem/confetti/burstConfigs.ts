/**
 * Burst Configuration Exports
 *
 * Re-exports configs from separate constants file and provides getter functions.
 */

import type { BurstConfig, BurstType } from './types';
import {
  CHAIN_COMPLETION_CONFIG,
  STREAK_MILESTONE_CONFIG,
  LEVEL_UP_CONFIG,
  PERFECT_WEEK_CONFIG,
  DEFAULT_CONFIG,
} from './burstConfigs.constants';

// Re-export for convenience
export {
  CHAIN_COMPLETION_CONFIG,
  STREAK_MILESTONE_CONFIG,
  LEVEL_UP_CONFIG,
  PERFECT_WEEK_CONFIG,
  DEFAULT_CONFIG,
} from './burstConfigs.constants';

/**
 * Get configuration for a burst type
 */
export function getBurstConfig(
  burstType: BurstType,
  isDarkMode: boolean
): BurstConfig {
  switch (burstType) {
    case 'chainCompletion': {
      return CHAIN_COMPLETION_CONFIG;
    }
    case 'streakMilestone': {
      return STREAK_MILESTONE_CONFIG;
    }
    case 'levelUp': {
      return LEVEL_UP_CONFIG;
    }
    case 'perfectWeek': {
      return PERFECT_WEEK_CONFIG;
    }
    default: {
      return DEFAULT_CONFIG;
    }
  }
}

/**
 * Get colors for a burst type based on theme
 */
export function getBurstColors(
  burstType: BurstType,
  isDarkMode: boolean
): string[] {
  const config = getBurstConfig(burstType, isDarkMode);
  return isDarkMode ? config.darkColors : config.colors;
}
