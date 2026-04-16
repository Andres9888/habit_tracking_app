/**
 * Algorithm Mode Configuration
 *
 * Grounded in Lally et al. (2010) asymptotic habit formation curve.
 * Growth rates calibrated so perfect daily execution reaches "Automatic"
 * (85%) in research-backed timeframes:
 *
 *   S(n) = 100 × (1 − (1−GR)^n)   →   GR = 1 − 0.15^(1/n)
 *
 * Forgiving: ~18 days — simple behaviors (Lally: drinking water)
 * Balanced:  ~63 days — population median (Lally: 66 days)
 * Strict:   ~145 days — complex/exercise (Lally: 91-254 days)
 *
 * Decay (baseDecay) applies proportionally on missed days, matching
 * the decay term HS(t)×HDP in Klein et al. (2011).
 */

export type StrengthAlgorithmMode = 'forgiving' | 'balanced' | 'strict';

export interface AlgorithmParams {
  growthRate: number;
  baseDecay: number;
}

export const ALGORITHM_CONFIGS: Record<StrengthAlgorithmMode, AlgorithmParams> =
  {
    forgiving: {
      baseDecay: 0.01,
      growthRate: 0.1,
    },
    balanced: {
      baseDecay: 0.02,
      growthRate: 0.03,
    },
    strict: {
      baseDecay: 0.04,
      growthRate: 0.013,
    },
  };

export const DEFAULT_ALGORITHM_MODE: StrengthAlgorithmMode = 'balanced';

export function getAlgorithmConfig(
  mode?: StrengthAlgorithmMode | null
): AlgorithmParams {
  return ALGORITHM_CONFIGS[mode ?? DEFAULT_ALGORITHM_MODE];
}

/**
 * Resolve effective algorithm mode from a per-habit setting.
 * Falls back to DEFAULT_ALGORITHM_MODE when unset or invalid.
 */
export function resolveAlgorithmMode(
  habitMode?: string | null
): StrengthAlgorithmMode {
  const mode = habitMode ?? DEFAULT_ALGORITHM_MODE;
  if (mode in ALGORITHM_CONFIGS) {
    return mode as StrengthAlgorithmMode;
  }
  return DEFAULT_ALGORITHM_MODE;
}
