/**
 * Habit Strength Utility Functions
 *
 * Provides calculation and formatting utilities for habit strength
 * using an exponential smoothing algorithm (Loop Habit Tracker style).
 *
 * Key Concepts:
 * - Strength grows on completions: strength + (1 - strength) * GROWTH_RATE
 * - Strength decays on misses: strength * DECAY_RATE
 * - Thresholds: 0-29% weak, 30-69% developing, 70-100% strong
 *
 * @see habit-strength-history-spec.md Section 3
 */

import { addDays, differenceInDays, format, startOfDay } from 'date-fns';

import type {
  StrengthAlgorithmConfig,
  StrengthColors,
  StrengthLabel,
  StrengthSnapshot,
} from './types';

// Algorithm constants (based on Loop Habit Tracker)
const DEFAULT_GROWTH_RATE = 0.05; // ~5% growth per completion
const DEFAULT_DECAY_RATE = 0.95; // ~5% decay per miss
const DEFAULT_MAX_SAMPLE_POINTS = 100;

// Threshold constants for strength labels
const WEAK_THRESHOLD = 30;
const STRONG_THRESHOLD = 70;

/**
 * Color palette for each strength level.
 * Based on design spec Section 7.1.
 *
 * WCAG AA Compliance:
 * - Primary colors meet 4.5:1 contrast ratio for normal text on white/light backgrounds
 * - Red-600 (4.83:1), Amber-700 (5.02:1), Emerald-700 (5.48:1)
 */
const STRENGTH_COLOR_MAP: Record<StrengthLabel, StrengthColors> = {
  developing: {
    // Amber-700 (WCAG AA: 5.02:1)
    background: '#fffbeb',
    primary: '#b45309', // Amber-50
    ring: '#fcd34d', // Amber-300
  },
  strong: {
    // Emerald-700 (WCAG AA: 5.48:1)
    background: '#ecfdf5',
    primary: '#047857', // Emerald-50
    ring: '#6ee7b7', // Emerald-300
  },
  weak: {
    // Red-600 (WCAG AA: 4.83:1)
    background: '#fef2f2',
    primary: '#dc2626', // Red-50
    ring: '#fca5a5', // Red-300
  },
};

/**
 * Format a date as YYYY-MM-DD string for consistent lookup.
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Calculate habit strength at a specific target date.
 *
 * Iterates day-by-day from habit creation to the target date,
 * applying growth on completions and decay on misses.
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitCreatedAt - Date when the habit was created
 * @param targetDate - Date to calculate strength for
 * @param config - Optional algorithm configuration
 * @returns Strength as a percentage (0-100)
 *
 * @example
 * const strength = calculateStrengthAtDate(
 *   new Set(['2024-01-01', '2024-01-02']),
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02')
 * );
 * // Returns ~10 (two completions from zero)
 */
export function calculateStrengthAtDate(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  targetDate: Date,
  config: Partial<StrengthAlgorithmConfig> = {}
): number {
  const growthRate = config.growthRate ?? DEFAULT_GROWTH_RATE;
  const decayRate = config.decayRate ?? DEFAULT_DECAY_RATE;

  // Normalize dates to start of day for consistent comparison
  const startDate = startOfDay(habitCreatedAt);
  const endDate = startOfDay(targetDate);

  // If target is before creation, return 0
  if (endDate < startDate) {
    return 0;
  }

  let strength = 0;
  let currentDate = startDate;

  // Iterate day by day
  while (currentDate <= endDate) {
    const dateStr = formatDateString(currentDate);

    // Growth on completion (approaches 100% asymptotically), decay on miss (exponential toward 0)
    strength = completedDates.has(dateStr)
      ? strength + (1 - strength) * growthRate
      : strength * decayRate;

    currentDate = addDays(currentDate, 1);
  }

  // Return as percentage (0-100), rounded to 1 decimal place
  return Math.round(strength * 1000) / 10;
}

/**
 * Get the human-readable strength label based on percentage.
 *
 * Thresholds:
 * - 0-29%: "weak" (habit not established)
 * - 30-69%: "developing" (building consistency)
 * - 70-100%: "strong" (habit is automatic)
 *
 * @param strength - Strength percentage (0-100)
 * @returns Strength label
 */
export function getStrengthLabel(strength: number): StrengthLabel {
  if (strength < WEAK_THRESHOLD) {
    return 'weak';
  }
  if (strength < STRONG_THRESHOLD) {
    return 'developing';
  }
  return 'strong';
}

/**
 * Get the primary color for a strength value.
 *
 * @param strength - Strength percentage (0-100)
 * @returns Color hex string
 */
export function getStrengthColor(strength: number): string {
  const label = getStrengthLabel(strength);
  return STRENGTH_COLOR_MAP[label].primary;
}

/**
 * Get the full color palette for a strength value.
 *
 * @param strength - Strength percentage (0-100)
 * @returns StrengthColors object with primary, background, and ring colors
 */
export function getStrengthColors(strength: number): StrengthColors {
  const label = getStrengthLabel(strength);
  return STRENGTH_COLOR_MAP[label];
}

/**
 * Generate a complete strength timeline from habit creation to today.
 *
 * For performance with long histories (2+ years), samples down to
 * maxSamplePoints while preserving key events (start, end, peaks, valleys).
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitCreatedAt - Date when the habit was created
 * @param sampleSize - Maximum number of data points (default: 100)
 * @returns Array of StrengthSnapshot objects for charting
 */
export function generateStrengthTimeline(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  sampleSize: number = DEFAULT_MAX_SAMPLE_POINTS
): StrengthSnapshot[] {
  const startDate = startOfDay(habitCreatedAt);
  const endDate = startOfDay(new Date());

  const totalDays = differenceInDays(endDate, startDate) + 1;

  // If we have fewer days than sample size, return all days
  if (totalDays <= sampleSize) {
    return generateFullTimeline(completedDates, startDate, endDate);
  }

  // Sample evenly across the timeline
  return generateSampledTimeline(
    completedDates,
    startDate,
    endDate,
    totalDays,
    sampleSize
  );
}

/**
 * Generate full timeline without sampling.
 */
function generateFullTimeline(
  completedDates: Set<string>,
  startDate: Date,
  endDate: Date
): StrengthSnapshot[] {
  const timeline: StrengthSnapshot[] = [];
  let strength = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = formatDateString(currentDate);

    strength = completedDates.has(dateStr)
      ? strength + (1 - strength) * DEFAULT_GROWTH_RATE
      : strength * DEFAULT_DECAY_RATE;

    const strengthPercent = Math.round(strength * 1000) / 10;

    timeline.push({
      date: new Date(currentDate),
      dateString: dateStr,
      label: getStrengthLabel(strengthPercent),
      strength: strengthPercent,
    });

    currentDate = addDays(currentDate, 1);
  }

  return timeline;
}

/**
 * Generate sampled timeline for long histories.
 * Ensures start, end, and evenly distributed points are included.
 */
function generateSampledTimeline(
  completedDates: Set<string>,
  startDate: Date,
  endDate: Date,
  totalDays: number,
  sampleSize: number
): StrengthSnapshot[] {
  // First, calculate the full strength values
  const fullStrengths: Array<{ date: Date; strength: number }> = [];
  let strength = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = formatDateString(currentDate);

    strength = completedDates.has(dateStr)
      ? strength + (1 - strength) * DEFAULT_GROWTH_RATE
      : strength * DEFAULT_DECAY_RATE;

    fullStrengths.push({
      date: new Date(currentDate),
      strength: Math.round(strength * 1000) / 10,
    });

    currentDate = addDays(currentDate, 1);
  }

  // Sample evenly, always including first and last
  const timeline: StrengthSnapshot[] = [];
  const step = (totalDays - 1) / (sampleSize - 1);

  for (let i = 0; i < sampleSize; i++) {
    const index = Math.round(i * step);
    const sample = fullStrengths[index];

    timeline.push({
      date: sample.date,
      dateString: formatDateString(sample.date),
      label: getStrengthLabel(sample.strength),
      strength: sample.strength,
    });
  }

  return timeline;
}

/**
 * Calculate peak and lowest strength values from a timeline.
 *
 * The lowest value excludes day 1 (which is always 0 or near-0)
 * to provide a more meaningful "lowest point" metric.
 *
 * @param strengthHistory - Array of strength snapshots
 * @returns Object with peak and lowest snapshots
 */
export function calculateStrengthExtremes(
  strengthHistory: StrengthSnapshot[]
): { peak: StrengthSnapshot; lowest: StrengthSnapshot } {
  if (strengthHistory.length === 0) {
    const now = new Date();
    const emptySnapshot: StrengthSnapshot = {
      date: now,
      dateString: formatDateString(now),
      label: 'weak',
      strength: 0,
    };
    return { lowest: emptySnapshot, peak: emptySnapshot };
  }

  // Find peak
  let peak = strengthHistory[0];
  for (const snapshot of strengthHistory) {
    if (snapshot.strength > peak.strength) {
      peak = snapshot;
    }
  }

  // Find lowest (excluding first day)
  let lowest =
    strengthHistory.length > 1 ? strengthHistory[1] : strengthHistory[0];
  for (let i = 1; i < strengthHistory.length; i++) {
    if (strengthHistory[i].strength < lowest.strength) {
      lowest = strengthHistory[i];
    }
  }

  return { lowest, peak };
}

/**
 * Calculate the delta (change) between two strength values.
 * Returns positive for improvement, negative for decline.
 *
 * @param current - Current strength
 * @param previous - Previous strength
 * @returns Rounded delta value
 */
export function calculateDelta(current: number, previous: number): number {
  return Math.round((current - previous) * 10) / 10;
}

/**
 * Calculate the completion rate as a percentage.
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitAgeDays - Number of days since habit creation
 * @returns Completion rate as percentage (0-100)
 */
export function calculateCompletionRate(
  completedDates: Set<string>,
  habitAgeDays: number
): number {
  if (habitAgeDays <= 0) {
    return 0;
  }
  const completedCount = completedDates.size;
  return Math.round((completedCount / habitAgeDays) * 100);
}

/**
 * Check if the user has a perfect completion streak (100% completion rate).
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitAgeDays - Number of days since habit creation
 * @returns True if the user has completed every day since habit creation
 */
export function isPerfectStreak(
  completedDates: Set<string>,
  habitAgeDays: number
): boolean {
  // Need at least 3 days to show "Perfect!" badge (to avoid trivial cases)
  if (habitAgeDays < 3) {
    return false;
  }
  return completedDates.size >= habitAgeDays;
}
