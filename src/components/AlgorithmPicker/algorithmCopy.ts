/** Single source of truth for habit-strength algorithm picker copy. */
import { Mountain, Sprout, TrendingUp } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type AlgorithmMode = 'forgiving' | 'balanced' | 'strict';

export interface AlgorithmCopyEntry {
  mode: AlgorithmMode;
  name: string;
  examples: string;
  description: string;
  daysToForm: number;
  Icon: LucideIcon;
}

export const ALGORITHM_COPY: Record<AlgorithmMode, AlgorithmCopyEntry> = {
  forgiving: {
    mode: 'forgiving',
    name: 'Simple',
    examples: '',
    description:
      'Tiny actions that take seconds. Grows fast, forgives slips.',
    daysToForm: 18,
    Icon: Sprout,
  },
  balanced: {
    mode: 'balanced',
    name: 'Average',
    examples: '',
    description:
      "The research default — steady gains, honest setbacks on misses. Based on UCL's 66-day study.",
    daysToForm: 66,
    Icon: TrendingUp,
  },
  strict: {
    mode: 'strict',
    name: 'Complex',
    examples: '',
    description:
      'Big commitments like running or meditation. Months to build, drops hard on misses — rewards showing up.',
    daysToForm: 120,
    Icon: Mountain,
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
