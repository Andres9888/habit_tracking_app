/** Single source of truth for habit-strength algorithm picker copy. */
import { Activity, Heart, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type AlgorithmMode = 'forgiving' | 'balanced' | 'strict';
export type HabitComplexity = 'Simple' | 'Moderate' | 'Complex';

export interface AlgorithmCopyEntry {
  mode: AlgorithmMode;
  name: string;
  complexity: HabitComplexity;
  examples: string;
  description: string;
  daysToForm: number;
  Icon: LucideIcon;
}

export const ALGORITHM_COPY: Record<AlgorithmMode, AlgorithmCopyEntry> = {
  forgiving: {
    mode: 'forgiving',
    name: 'Forgiving',
    complexity: 'Simple',
    examples: 'A glass of water, taking a vitamin, one push-up.',
    description:
      "Forms fast and missing a day barely matters — you'll do it tomorrow anyway.",
    daysToForm: 18,
    Icon: Heart,
  },
  balanced: {
    mode: 'balanced',
    name: 'Balanced',
    complexity: 'Moderate',
    examples: 'Journaling, reading, stretching.',
    description:
      'The typical 66-day formation curve from UCL research — noticeable dip on a miss, recovers quickly.',
    daysToForm: 66,
    Icon: Activity,
  },
  strict: {
    mode: 'strict',
    name: 'Strict',
    complexity: 'Complex',
    examples: 'Running 5K, meditation, learning an instrument.',
    description:
      'Takes much longer to build — tight accountability keeps you showing up through the long climb.',
    daysToForm: 120,
    Icon: Zap,
  },
};

export const ALGORITHM_ORDER: AlgorithmMode[] = [
  'forgiving',
  'balanced',
  'strict',
];

export const DEFAULT_ALGORITHM: AlgorithmMode = 'balanced';

export function isAlgorithmMode(value: string | undefined): value is AlgorithmMode {
  return value === 'forgiving' || value === 'balanced' || value === 'strict';
}
