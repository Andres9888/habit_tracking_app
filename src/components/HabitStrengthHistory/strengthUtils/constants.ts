import type { StrengthColors, StrengthLabel } from '../types';
import { colors } from '../../../theme/colors';

// Algorithm constants (based on Loop Habit Tracker)
export const DEFAULT_GROWTH_RATE = 0.05; // ~5% growth per completion
export const DEFAULT_DECAY_RATE = 0.95; // ~5% decay per miss
export const DEFAULT_MAX_SAMPLE_POINTS = 100;

// Threshold constants for strength labels
export const WEAK_THRESHOLD = 30;
export const STRONG_THRESHOLD = 70;

/**
 * Color palette for each strength level.
 * Based on design spec Section 7.1.
 *
 * WCAG AA Compliance:
 * - Primary colors meet 4.5:1 contrast ratio for normal text on white/light backgrounds
 * - Red-600 (4.83:1), Amber-700 (5.02:1), Emerald-700 (5.48:1)
 */
export const STRENGTH_COLOR_MAP: Record<StrengthLabel, StrengthColors> = {
  developing: {
    background: '#fffbeb',          // Amber-50
    primary: '#b45309',             // Amber-700 (WCAG AA: 5.02:1)
    ring: '#fcd34d',                // Amber-300
  },
  strong: {
    background: colors.primary[100], // #D1FAE5 — Emerald-50 equivalent
    primary: colors.primary[700],    // #047857 (WCAG AA: 5.48:1)
    ring: colors.primary[300],       // #6EE7B7
  },
  weak: {
    background: '#fef2f2',           // Red-50
    primary: colors.error,           // #B53030 (WCAG AA 5.45:1)
    ring: '#fca5a5',                 // Red-300
  },
};
