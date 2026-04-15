/**
 * Algorithm Mode Configuration
 * Defines Forgiving, Balanced, and Strict strength calculation parameters
 */

export type StrengthAlgorithmMode = 'forgiving' | 'balanced' | 'strict';

export interface AlgorithmParams {
  growthRate: number;
  baseDecay: number;
  shieldEffectiveness: number;
}

export const ALGORITHM_CONFIGS: Record<StrengthAlgorithmMode, AlgorithmParams> =
  {
    forgiving: {
      baseDecay: 0.01,
      growthRate: 0.04,
      shieldEffectiveness: 0.85,
    },
    balanced: {
      baseDecay: 0.02,
      growthRate: 0.03,
      shieldEffectiveness: 0.7,
    },
    strict: {
      baseDecay: 0.04,
      growthRate: 0.05,
      shieldEffectiveness: 0.35,
    },
  };

export const DEFAULT_ALGORITHM_MODE: StrengthAlgorithmMode = 'balanced';

export function getAlgorithmConfig(
  mode?: StrengthAlgorithmMode | null
): AlgorithmParams {
  return ALGORITHM_CONFIGS[mode ?? DEFAULT_ALGORITHM_MODE];
}

/**
 * Resolve effective algorithm mode from per-habit and global settings.
 * Priority: habit override > user setting > default ('balanced')
 */
export function resolveAlgorithmMode(
  habitMode?: string | null,
  userSettingMode?: string | null
): StrengthAlgorithmMode {
  const mode = habitMode ?? userSettingMode ?? DEFAULT_ALGORITHM_MODE;
  if (mode in ALGORITHM_CONFIGS) {
    return mode as StrengthAlgorithmMode;
  }
  return DEFAULT_ALGORITHM_MODE;
}
