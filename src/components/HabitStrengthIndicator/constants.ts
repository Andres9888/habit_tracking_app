/**
 * Strength Level Configuration
 * Colors from theme/colors.ts strength levels
 *
 * States: Starting 🌱 (0-20%), Building 🌿 (20-40%), Developing 🌳 (40-60%),
 *         Strong 💪 (60-80%), Automatic ⚡ (80-100%)
 */

import type { StrengthLevel, StrengthLevelConfig } from './types';

export const STRENGTH_LEVEL_CONFIG: Record<StrengthLevel, StrengthLevelConfig> =
  {
    automatic: {
      description: 'Fully automatic',
      emoji: '⚡',
      label: 'Automatic',
      maxThreshold: 100,
      minThreshold: 80,
    },
    building: {
      description: 'Making progress',
      emoji: '🌿',
      label: 'Building',
      maxThreshold: 40,
      minThreshold: 20,
    },
    developing: {
      description: 'Getting stronger',
      emoji: '🌳',
      label: 'Developing',
      maxThreshold: 60,
      minThreshold: 40,
    },
    starting: {
      description: 'Just beginning',
      emoji: '🌱',
      label: 'Starting Out',
      maxThreshold: 20,
      minThreshold: 0,
    },
    strong: {
      description: 'Well-established',
      emoji: '💪',
      label: 'Strong',
      maxThreshold: 80,
      minThreshold: 60,
    },
  };
