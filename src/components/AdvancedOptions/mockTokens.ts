/**
 * Strength Curve display copy — v3 implementable-mock contract.
 * Maps algorithm modes → Simple / Average / Complex curve copy + sparks.
 * Spark paths are ported verbatim from STRENGTH_CURVES in the contract HTML
 * (viewBox 0 0 100 36) — do not hand-tune, keep in sync with the mock.
 */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';

export type CurveMockCopy = {
  name: string;
  growthPct: number;
  value: string;
  days: number;
  missLabel: string;
  desc: string;
  sparkPath: string;
  sparkFillPath: string;
};

export const CURVE_MOCK_COPY: Record<AlgorithmMode, CurveMockCopy> = {
  forgiving: {
    name: 'Simple',
    growthPct: 10,
    value: 'Simple · +10% per check-in',
    days: 18,
    missLabel: 'Soft miss cost',
    desc: 'Fast climb for easy daily habits',
    sparkPath: 'M2 28 C 18 26, 28 22, 40 18 S 70 8, 98 4',
    sparkFillPath: 'M2 28 C 18 26, 28 22, 40 18 S 70 8, 98 4 L 98 34 L 2 34 Z',
  },
  balanced: {
    name: 'Average',
    growthPct: 3,
    value: 'Average · +3% per check-in',
    days: 66,
    missLabel: 'Medium miss cost',
    desc: 'Steady rise for typical habits',
    sparkPath: 'M2 30 C 22 28, 40 24, 55 20 S 80 12, 98 8',
    sparkFillPath: 'M2 30 C 22 28, 40 24, 55 20 S 80 12, 98 8 L 98 34 L 2 34 Z',
  },
  strict: {
    name: 'Complex',
    growthPct: 1,
    value: 'Complex · +1% per check-in',
    days: 145,
    missLabel: 'Gentlest miss cost',
    desc: 'Slow climb for hard or long habits',
    sparkPath: 'M2 31 C 30 30, 50 27, 68 24 S 88 18, 98 14',
    sparkFillPath:
      'M2 31 C 30 30, 50 27, 68 24 S 88 18, 98 14 L 98 34 L 2 34 Z',
  },
};

/** Compare strip cells, left → right climb (Simple → Average → Complex). */
export const CURVE_STRIP: { mode: AlgorithmMode; pct: string }[] = [
  { mode: 'forgiving', pct: '+10%' },
  { mode: 'balanced', pct: '+3%' },
  { mode: 'strict', pct: '+1%' },
];

/** Habit type → default curve (contract §2). */
export const GROWTH_TO_MODE: Record<GrowthType, AlgorithmMode> = {
  simple: 'forgiving',
  average: 'balanced',
  complex: 'strict',
};

/** "Detected habit type" bar copy, keyed by growth type. */
export const TYPE_BAR_COPY: Record<
  GrowthType,
  { label: string; tagline: string }
> = {
  simple: { label: 'Simple', tagline: 'easier habits climb faster' },
  average: { label: 'Average', tagline: 'steady middle-ground climb' },
  complex: { label: 'Complex', tagline: 'harder habits climb slower' },
};
