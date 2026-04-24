/** Single source of truth for habit-strength algorithm picker copy. */
import { Activity, Heart, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type AlgorithmMode = 'forgiving' | 'balanced' | 'strict';
export type HabitComplexity = 'Simple' | 'Everyday' | 'Complex';

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
    name: 'Quick Win',
    complexity: 'Simple',
    examples: '',
    description:
      'Tiny actions that take seconds. Grows fast, forgives slips.',
    daysToForm: 18,
    Icon: Heart,
  },
  balanced: {
    mode: 'balanced',
    name: 'Textbook',
    complexity: 'Everyday',
    examples: '',
    description:
      "The research default — steady gains, honest setbacks on misses. Based on UCL's 66-day study.",
    daysToForm: 66,
    Icon: Activity,
  },
  strict: {
    mode: 'strict',
    name: 'Long Haul',
    complexity: 'Complex',
    examples: '',
    description:
      'Big commitments like running or meditation. Months to build, drops hard on misses — rewards showing up.',
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
