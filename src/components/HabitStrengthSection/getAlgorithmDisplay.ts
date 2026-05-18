/**
 * Display metadata for each strength algorithm mode.
 *
 * Day targets are pre-computed from the Lally-calibrated growth rates in
 * convex/habitStrength/algorithmConfig.ts using n = log(0.15)/log(1−GR),
 * the number of perfect days needed to reach the 85% "automatic" threshold.
 */

import {
  resolveAlgorithmMode,
  type StrengthAlgorithmMode,
} from '../../../convex/habitStrength/algorithmConfig';

export interface AlgorithmDisplay {
  mode: StrengthAlgorithmMode;
  label: string;
  daysToFormed: number;
  description: string;
}

const ALGORITHM_DISPLAY: Record<StrengthAlgorithmMode, AlgorithmDisplay> = {
  forgiving: {
    mode: 'forgiving',
    label: 'Forgiving',
    daysToFormed: 18,
    description:
      'Simple behaviors form fast — ~18 days of consistency reaches the habit-formed threshold.',
  },
  balanced: {
    mode: 'balanced',
    label: 'Balanced',
    daysToFormed: 63,
    description:
      'Population median — ~63 days of consistency reaches the habit-formed threshold (Lally 2010).',
  },
  strict: {
    mode: 'strict',
    label: 'Strict',
    daysToFormed: 145,
    description:
      'Complex habits take longer — ~145 days of consistency reaches the habit-formed threshold.',
  },
};

export function getAlgorithmDisplay(
  habitMode?: string | null
): AlgorithmDisplay {
  return ALGORITHM_DISPLAY[resolveAlgorithmMode(habitMode)];
}
