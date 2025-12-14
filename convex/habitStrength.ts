/**
 * Habit Strength Calculation System
 * Logistic baseline (habit age) × Beta-smoothed compliance (recent execution)
 *
 * Baseline curve calibrated to hit ~22% on day 7 and ~99% on day 90.
 * Compliance uses a 30-day rolling window with Laplace smoothing.
 *
 * Legacy constants/functions from the original Klein et al. (2011) model are
 * retained for backwards compatibility with utilities and tests.
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Legacy Klein-model constants kept for compatibility with older tooling/tests.
export const DEFAULT_HABIT_DECAY_PARAM = 0.02; // HDP: Adjusted for higher equilibrium (~88%)
export const DEFAULT_HABIT_GAIN_PARAM = 0.15; // HGP: Empirically validated optimal range 0.1-0.2
export const CONTEXT_CONSISTENCY = 1; // Cuet: Simplified to 1.0 (same context assumed)

// Memory Accessibility Parameters (Tobias, 2009; Zhang et al., 2021)
const DEFAULT_ACCESSIBILITY_DECAY_PARAM = 0.3; // ADP: Memory decay rate
const DEFAULT_ACCESSIBILITY_GAIN_BEHAVIOR = 0.5; // AGP_beh: Boost from behavior execution
const DEFAULT_ACCESSIBILITY_GAIN_REMINDER = 0.7; // AGP_rem: Boost from reminders

/**
 * Strength levels based on psychological research
 * - Starting (0.0-0.2): Initial phase, high intervention needed
 * - Building (0.2-0.4): Early formation, frequent reminders helpful
 * - Developing (0.4-0.6): Mid-formation, occasional support needed
 * - Strong (0.6-0.8): Well-established, minimal support needed
 * - Automatic (0.8-1.0): Fully habitual, automatic execution
 */
export type StrengthLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

export interface HabitTrackingRecord {
  date: string;
  completed: boolean;
}

export interface HabitStrengthSnapshot {
  strength: number;
  strengthLevel: StrengthLevel;
  baseline: number;
  compliance: number;
  complianceSuccesses: number;
  complianceDaysConsidered: number;
  daysSinceCreation: number;
  lastEvaluatedDate: Date;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LOGISTIC_SLOPE = 0.070_611_882_210_432_05; // Calibrated for ~22% at day 7
const LOGISTIC_MIDPOINT = 24.924_269_028_255_548;
const LOGISTIC_TARGET_DAY = 90;
const COMPLIANCE_WINDOW_DAYS = 30;
const COMPLIANCE_PRIOR_ALPHA = 1;
const COMPLIANCE_PRIOR_BETA = 1;

// ============================================================================
// NEW MOMENTUM-BASED FORMULA (v2.0) - Forgiving strength calculation
// ============================================================================

/**
 * Growth rate: percentage of remaining gap filled per completion
 * Set to 3% means each completion fills 3% of the distance to 100%
 * Results in exponential approach to 100% over ~66 days with perfect compliance
 */
export const GROWTH_RATE = 0.03;

/**
 * Base decay rate: percentage lost per miss without streak protection
 * Set to 2% base decay, reduced by streak shield effectiveness
 */
export const BASE_DECAY = 0.02;

/**
 * Streak shield effectiveness: how much the streak protects against decay
 * Set to 70% means a perfect 7-day streak reduces decay by 70%
 * Range: 0 (no protection) to 1 (full protection)
 */
export const SHIELD_EFFECTIVENESS = 0.7;

/**
 * Calculate new habit strength after a completion or miss using momentum-based formula.
 *
 * This forgiving formula encourages consistency while being gentle on misses:
 * - **Growth on completion**: Fills 3% of remaining gap toward 100
 * - **Graceful decay on miss**: Protected by recent consistency (streak shield)
 * - **66-day target**: Perfect compliance reaches ~87% strength (Automatic level)
 *
 * Formula behavior:
 * - Miss 1 day after good streak (7/7 last week): <0.5% drop (very forgiving)
 * - Miss 3 days in row after 30-day streak: <2% total drop (gentle decay)
 * - Recovery from bad week: gradual with 3% gap fill per completion
 *
 * @param currentStrength - Current strength value (0-100)
 * @param completed - Whether the habit was completed today
 * @param completionsLast7Days - Number of completions in last 7 days (0-7), used for streak shield
 * @returns New strength value (0-100), clamped to valid range
 *
 * @example
 * // Growth: 50% strength, completed today
 * calculateNewStrength(50, true, 7) // Returns ~51.5
 *
 * @example
 * // Decay with full protection: 50% strength, missed today, perfect 7-day streak
 * calculateNewStrength(50, false, 7) // Returns ~49.7 (only 0.3% drop due to 70% shield)
 *
 * @example
 * // Decay with no protection: 50% strength, missed today, no recent completions
 * calculateNewStrength(50, false, 0) // Returns ~49.0 (full 2% decay)
 */
export function calculateNewStrength(
  currentStrength: number,
  completed: boolean,
  completionsLast7Days: number
): number {
  // Ensure inputs are within valid ranges
  const strength = Math.max(0, Math.min(100, currentStrength));
  const recentCompletions = Math.max(0, Math.min(7, completionsLast7Days));

  if (completed) {
    // Growth: Fill GROWTH_RATE (3%) of remaining gap toward 100
    // Example: 50% + (100 - 50) * 0.03 = 50% + 1.5% = 51.5%
    // As strength increases, growth slows (exponential approach)
    const gap = 100 - strength;
    const growth = gap * GROWTH_RATE;
    return Math.min(100, strength + growth);
  } else {
    // Decay: Protected by recent consistency (streak shield)
    // Streak shield: 0/7 = 0% protection, 7/7 = 100% protection
    const streakShield = recentCompletions / 7;

    // Protected decay = base decay reduced by (shield × effectiveness)
    // Example with 7/7 streak: 0.02 * (1 - 1.0 * 0.7) = 0.006 (70% less decay)
    // Example with 0/7 streak: 0.02 * (1 - 0 * 0.7) = 0.02 (full decay)
    const protectedDecay = BASE_DECAY * (1 - streakShield * SHIELD_EFFECTIVENESS);

    // Apply multiplicative decay (percentage-based, not absolute)
    // Example: 50% * (1 - 0.006) = 49.7% (0.3% drop with full protection)
    return Math.max(0, strength * (1 - protectedDecay));
  }
}

// ============================================================================
// MOMENTUM-BASED STRENGTH SIMULATION (day-by-day, including missed days)
// ============================================================================

function isValidDateKey(dateKey: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

function parseDateKeyToLocalDate(dateKey: string): Date {
  if (!isValidDateKey(dateKey)) {
    throw new Error('Invalid date format; expected YYYY-MM-DD');
  }

  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const parsed = new Date(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);

  // Validate we didn't roll the date (e.g. 2025-13-40)
  if (formatDateKey(parsed) !== dateKey) {
    throw new Error('Invalid date value; expected YYYY-MM-DD');
  }

  return parsed;
}

export function calculateMomentumStrengthSnapshot({
  habitCreatedAt,
  throughDate,
  tracking,
}: {
  habitCreatedAt: number;
  throughDate?: string;
  tracking: HabitTrackingRecord[];
}): {
  daysProcessed: number;
  strength: number;
  strength100: number;
  strengthLevel: StrengthLevel;
} {
  const evaluationDateKey = throughDate ?? formatDateKey(startOfDay(new Date()));
  const evaluationDate = parseDateKeyToLocalDate(evaluationDateKey);
  const creationDate = startOfDay(new Date(habitCreatedAt));

  if (creationDate.getTime() > evaluationDate.getTime()) {
    return {
      daysProcessed: 0,
      strength: 0,
      strength100: 0,
      strengthLevel: getStrengthLevel(0),
    };
  }

  const completionDates = new Set(
    tracking.filter((record) => record.completed).map((record) => record.date)
  );

  const daysProcessed =
    Math.floor((evaluationDate.getTime() - creationDate.getTime()) / MS_PER_DAY) +
    1;

  let strength100 = 0;

  for (
    let cursor = new Date(creationDate);
    cursor.getTime() <= evaluationDate.getTime();
    cursor = addDays(cursor, 1)
  ) {
    const dateKey = formatDateKey(cursor);
    const wasCompleted = completionDates.has(dateKey);

    let completionsLast7Days = 0;
    for (let offset = 1; offset <= 7; offset++) {
      const previousKey = formatDateKey(addDays(cursor, -offset));
      if (completionDates.has(previousKey)) {
        completionsLast7Days++;
      }
    }

    strength100 = calculateNewStrength(
      strength100,
      wasCompleted,
      completionsLast7Days
    );
  }

  const strength = strength100 / 100;

  return {
    daysProcessed,
    strength,
    strength100,
    strengthLevel: getStrengthLevel(strength),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function logisticRaw(daysSinceCreation: number): number {
  return (
    1 /
    (1 + Math.exp(-LOGISTIC_SLOPE * (daysSinceCreation - LOGISTIC_MIDPOINT)))
  );
}

const LOGISTIC_TARGET_VALUE = logisticRaw(LOGISTIC_TARGET_DAY);

function logisticBaseline(daysSinceCreation: number): number {
  if (daysSinceCreation >= LOGISTIC_TARGET_DAY) {
    return 1;
  }

  const raw = logisticRaw(daysSinceCreation);
  if (LOGISTIC_TARGET_VALUE === 0) {
    return clamp(raw, 0, 1);
  }

  return clamp(raw / LOGISTIC_TARGET_VALUE, 0, 1);
}

function computeCompliance({
  habitCreatedAt,
  trackingMap,
  evaluationDate,
}: {
  habitCreatedAt: number;
  trackingMap: Map<string, boolean>;
  evaluationDate: Date;
}): { compliance: number; successes: number; daysConsidered: number } {
  const creationDate = startOfDay(new Date(habitCreatedAt));
  const windowStartCandidate = addDays(
    evaluationDate,
    -(COMPLIANCE_WINDOW_DAYS - 1)
  );
  const startDate = new Date(
    Math.max(windowStartCandidate.getTime(), creationDate.getTime())
  );

  let successes = 0;
  let daysConsidered = 0;

  for (
    let cursor = new Date(startDate);
    cursor.getTime() <= evaluationDate.getTime();
    cursor = addDays(cursor, 1)
  ) {
    daysConsidered++;
    const key = formatDateKey(cursor);
    const completed = trackingMap.get(key) ?? false;
    if (completed) {
      successes++;
    }
  }

  // No days to consider = 0% compliance (not inflated)
  if (daysConsidered === 0) {
    return {
      compliance: 0,
      daysConsidered: 0,
      successes: 0,
    };
  }

  // Simple ratio: 0 completions = 0%, all completions = 100%
  // No Laplace smoothing - what you do is what you get
  const compliance = successes / daysConsidered;

  return { compliance, daysConsidered, successes };
}

export function generateHabitStrengthSnapshot({
  habitCreatedAt,
  tracking,
  throughDate = startOfDay(new Date()),
}: {
  habitCreatedAt: number;
  tracking: HabitTrackingRecord[];
  throughDate?: Date;
}): HabitStrengthSnapshot {
  const evaluationDate = startOfDay(throughDate);
  const creationDate = startOfDay(new Date(habitCreatedAt));
  const daysSinceCreation = Math.max(
    0,
    Math.floor((evaluationDate.getTime() - creationDate.getTime()) / MS_PER_DAY)
  );

  const trackingMap = new Map<string, boolean>();
  for (const entry of tracking) {
    trackingMap.set(entry.date, entry.completed);
  }

  const baseline = logisticBaseline(daysSinceCreation);
  const complianceStats = computeCompliance({
    evaluationDate,
    habitCreatedAt,
    trackingMap,
  });

  // New formula: Compliance is primary driver, baseline is a time bonus
  // - 0% compliance = 0% strength (always)
  // - 100% compliance + time = up to 100% strength
  // Formula: compliance × (0.4 + 0.6 × baseline)
  // Day 1 with 100% compliance = 100% × (0.4 + 0.6 × 0.15) = ~49%
  // Day 7 with 100% compliance = 100% × (0.4 + 0.6 × 0.22) = ~53%
  // Day 30 with 100% compliance = 100% × (0.4 + 0.6 × 0.50) = ~70%
  // Day 90 with 100% compliance = 100% × (0.4 + 0.6 × 1.0) = 100%
  const timeBonus = 0.4 + 0.6 * baseline;
  const strength = clamp(complianceStats.compliance * timeBonus, 0, 1);

  return {
    baseline,
    compliance: complianceStats.compliance,
    complianceDaysConsidered: complianceStats.daysConsidered,
    complianceSuccesses: complianceStats.successes,
    daysSinceCreation,
    lastEvaluatedDate: evaluationDate,
    strength,
    strengthLevel: getStrengthLevel(strength),
  };
}

interface StrengthLevelInfo {
  level: StrengthLevel;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export const STRENGTH_LEVELS: Record<StrengthLevel, StrengthLevelInfo> = {
  automatic: {
    color: '#15803d',
    description: 'Fully automatic - amazing!',
    emoji: '⚡',
    label: 'Automatic',
    level: 'automatic', // green-700
  },
  building: {
    color: '#4ade80',
    description: 'Making progress - keep it up!',
    emoji: '🌿',
    label: 'Building',
    level: 'building', // green-400
  },
  developing: {
    color: '#22c55e',
    description: 'Getting stronger each day!',
    emoji: '🌳',
    label: 'Developing',
    level: 'developing', // green-500 (deprecated - kept for backwards compatibility)
  },
  starting: {
    color: '#86efac',
    description: 'Just beginning - stay focused!',
    emoji: '🌱',
    label: 'Starting Out',
    level: 'starting', // green-300
  },
  strong: {
    color: '#22c55e',
    description: 'Habit is well-established!',
    emoji: '💪',
    label: 'Strong',
    level: 'strong', // green-500 (updated to match new spec)
  },
};

/**
 * Calculate habit strength using Klein et al. (2011) equation:
 * HSt+1 = HSt - (HSt × HDP) + ((1 - HSt) × Beht × Cuet × HGP)
 *
 * Where:
 * - HSt: Current habit strength (0-1)
 * - HDP: Habit decay parameter (how fast habits weaken)
 * - HGP: Habit gain parameter (how fast habits strengthen)
 * - Beht: Behavior performed (1) or not (0)
 * - Cuet: Context consistency (simplified to 1.0)
 *
 * Key insights:
 * - Diminishing returns: (1 - HSt) means early repetitions matter more
 * - Proportional decay: HSt × HDP means stronger habits decay slower
 * - Asymptotic growth: Strength approaches but never exceeds 1.0
 */
export function calculateHabitStrength(
  currentStrength: number,
  behaviorPerformed: boolean,
  habitDecayParam: number = DEFAULT_HABIT_DECAY_PARAM,
  habitGainParam: number = DEFAULT_HABIT_GAIN_PARAM
): number {
  // Ensure current strength is bounded [0, 1]
  const HS = Math.max(0, Math.min(1, currentStrength));

  // Behavior indicator (1 if performed, 0 if not)
  const Beh = behaviorPerformed ? 1 : 0;

  // Context consistency (simplified to 1.0)
  const Cue = CONTEXT_CONSISTENCY;

  // Klein et al. equation
  const decay = HS * habitDecayParam;
  const gain = (1 - HS) * Beh * Cue * habitGainParam;
  const newStrength = HS - decay + gain;

  // Ensure result is bounded [0, 1]
  return Math.max(0, Math.min(1, newStrength));
}

/**
 * Determine strength level from numerical strength value
 * Updated thresholds for v2.0 momentum-based formula:
 * - 0-29%: Starting (just beginning)
 * - 30-59%: Building (making progress)
 * - 60-84%: Strong (well-established)
 * - 85-100%: Automatic (fully habitual)
 */
export function getStrengthLevel(strength: number): StrengthLevel {
  // Convert 0-100 scale to 0-1 if needed (backwards compatible)
  const normalizedStrength = strength > 1 ? strength / 100 : strength;

  if (normalizedStrength < 0.3) return 'starting';
  if (normalizedStrength < 0.6) return 'building';
  if (normalizedStrength < 0.85) return 'strong';
  return 'automatic';
}

/**
 * Calculate memory accessibility using Tobias (2009) equation
 * Validated by Zhang et al. (2021) for behavior change support systems
 *
 * Acc(t+1) = Acc(t) - Acc(t) × ADP + (1 - Acc(t)) × (Beh(t) × AGP_beh + Rem(t) × AGP_rem)
 *
 * Memory accessibility represents how easily a behavioral option comes to mind.
 * When accessibility is high, the habit is more likely to be recalled and performed.
 *
 * @param currentAccessibility - Current accessibility value (0-1)
 * @param behaviorPerformed - Whether the behavior was performed (boolean)
 * @param reminderReceived - Whether a reminder was received (boolean)
 * @param accessibilityDecayParam - ADP: Natural memory decay rate
 * @param accessibilityGainBehavior - AGP_beh: Boost from behavior execution
 * @param accessibilityGainReminder - AGP_rem: Boost from external reminders
 * @returns New accessibility value (0-1)
 */
export function calculateMemoryAccessibility(
  currentAccessibility: number,
  behaviorPerformed: boolean,
  reminderReceived: boolean,
  accessibilityDecayParam: number = DEFAULT_ACCESSIBILITY_DECAY_PARAM,
  accessibilityGainBehavior: number = DEFAULT_ACCESSIBILITY_GAIN_BEHAVIOR,
  accessibilityGainReminder: number = DEFAULT_ACCESSIBILITY_GAIN_REMINDER
): number {
  // Ensure current accessibility is bounded [0, 1]
  const Acc = Math.max(0, Math.min(1, currentAccessibility));

  // Behavior indicator (1 if performed, 0 if not)
  const Beh = behaviorPerformed ? 1 : 0;

  // Reminder indicator (1 if received, 0 if not)
  const Rem = reminderReceived ? 1 : 0;

  // Tobias (2009) equation from Zhang et al. (2021)
  const decay = Acc * accessibilityDecayParam;
  const gain =
    (1 - Acc) *
    (Beh * accessibilityGainBehavior + Rem * accessibilityGainReminder);
  const newAccessibility = Acc - decay + gain;

  // Ensure result is bounded [0, 1]
  return Math.max(0, Math.min(1, newAccessibility));
}

/**
 * Calculate predicted probability of future behavior completion
 * Based on both habit strength and memory accessibility (Zhang et al., 2021)
 * Achieved 65-77% prediction accuracy in empirical field studies
 *
 * The combined model uses both:
 * - Habit Strength: The learned association between behavior and context
 * - Memory Accessibility: How easily the behavior comes to mind
 *
 * @param habitStrength - Computed habit strength (0-1)
 * @param accessibility - Memory accessibility (0-1)
 * @returns Predicted probability of completion (0-1)
 */
export function predictCompletionProbability(
  habitStrength: number,
  accessibility: number = 1
): number {
  // Zhang et al. (2021) found that habit strength was the primary predictor
  // but accessibility contributes to behavior recall in daily environments

  // Base probability from habit strength (primary predictor)
  const baseProbability = 0.3; // Baseline completion rate
  const strengthBonus = habitStrength * 0.5; // Up to 50% from strength

  // Accessibility bonus (secondary predictor)
  // Low accessibility means behavior might be "forgotten" even if habit is strong
  const accessibilityMultiplier = 0.5 + accessibility * 0.5; // 0.5 to 1.0 range

  // Combined prediction
  const probability =
    (baseProbability + strengthBonus) * accessibilityMultiplier;

  return Math.min(0.95, Math.max(0.05, probability)); // Cap between 5% and 95%
}

/**
 * Update habit strength for a given habit based on today's completion status
 * @deprecated Use tracking.toggleCompletion instead, which uses the new momentum-based formula
 * This function is kept for backwards compatibility and also updated to use new formula
 */
export const updateHabitStrength = mutation({
  args: {
    behaviorPerformed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    try {
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        console.error('❌ Habit not found:', args.habitId);
        throw new Error('Habit not found');
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
        throw new Error('Invalid date format; expected YYYY-MM-DD');
      }

      const previousStrength = habit.strength ?? 0;

      // Update tracking record
      const trackingForDay = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) =>
          q.eq('habitId', args.habitId).eq('date', args.date)
        )
        .unique();

      if (trackingForDay) {
        if (trackingForDay.completed !== args.behaviorPerformed) {
          await ctx.db.patch(trackingForDay._id, {
            completed: args.behaviorPerformed,
          });
        }
      } else {
        await ctx.db.insert('tracking', {
          completed: args.behaviorPerformed,
          date: args.date,
          habitId: args.habitId,
        });
      }

      // Calculate completionsLast7Days for streak shield
      const toggleDate = new Date(args.date);
      const sevenDaysAgo = new Date(toggleDate);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const allTracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      let completionsLast7Days = 0;
      for (const record of allTracking) {
        const recordDate = new Date(record.date);
        if (recordDate >= sevenDaysAgo && recordDate < toggleDate && record.completed) {
          completionsLast7Days++;
        }
      }

      // Use NEW momentum-based formula
      const newStrength = calculateNewStrength(
        previousStrength * 100,
        args.behaviorPerformed,
        completionsLast7Days
      ) / 100;

      const strengthLevel = getStrengthLevel(newStrength);

      console.log('🔧 Updating habit strength (legacy API):', {
        behaviorPerformed: args.behaviorPerformed,
        completionsLast7Days,
        date: args.date,
        habitName: habit.name,
        newStrength: (newStrength * 100).toFixed(1) + '%',
        previousStrength: (previousStrength * 100).toFixed(1) + '%',
        strengthLevel,
      });

      // Update habit
      await ctx.db.patch(args.habitId, {
        strength: newStrength,
        strengthLevel,
        strengthUpdatedAt: Date.now(),
      });

      return {
        baseline: 0, // Deprecated field, kept for API compatibility
        compliance: 0, // Deprecated field, kept for API compatibility
        daysSinceCreation: 0, // Deprecated field, kept for API compatibility
        newStrength,
        predictionProbability: predictCompletionProbability(newStrength),
        previousStrength,
        strengthLevel,
      };
    } catch (error) {
      console.error('❌ Error in updateHabitStrength:', error);
      console.error(
        '  Stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );
      throw error;
    }
  },
  returns: v.object({
    baseline: v.number(),
    compliance: v.number(),
    daysSinceCreation: v.number(),
    newStrength: v.number(),
    predictionProbability: v.number(),
    previousStrength: v.number(),
    strengthLevel: v.string(),
  }),
});

/**
 * Recalculate habit strength for all past tracking data using NEW momentum-based formula
 * Simulates completing habits day by day with the new formula, including missed days
 * Useful for initializing strength for existing habits after formula change
 */
export const recalculateHabitStrength = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    try {
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        console.error('❌ Habit not found:', args.habitId);
        throw new Error('Habit not found');
      }

      console.log('🔄 Recalculating strength with NEW formula for:', habit.name);

      // Get all tracking data for this habit
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      console.log(`  ▸ Found ${tracking.length} tracking entries`);

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        tracking: tracking.map((entry) => ({
          completed: entry.completed,
          date: entry.date,
        })),
      });

      console.log(
        `  ✅ Calculated with NEW formula: strength=${snapshot.strength100.toFixed(
          1
        )}%, level=${snapshot.strengthLevel}, completions=${tracking.filter((r) => r.completed).length}`
      );

      // Update habit with final strength
      await ctx.db.patch(args.habitId, {
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: Date.now(),
      });

      return {
        daysProcessed: snapshot.daysProcessed,
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
      };
    } catch (error) {
      console.error('❌ Error in recalculateHabitStrength:', error);
      console.error(
        '  Stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );
      throw error;
    }
  },
  returns: v.object({
    daysProcessed: v.number(),
    strength: v.number(),
    strengthLevel: v.string(),
  }),
});

/**
 * Get habit strength info including level details
 */
export const getHabitStrengthInfo = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const snapshot = generateHabitStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      throughDate: startOfDay(new Date()),
      tracking: tracking.map((t) => ({
        completed: t.completed,
        date: t.date,
      })),
    });

    const strength = habit.strength ?? snapshot.strength;
    const level = habit.strengthLevel ?? snapshot.strengthLevel;
    const levelInfo = STRENGTH_LEVELS[level as StrengthLevel];

    return {
      baseline: snapshot.baseline,
      compliance: snapshot.compliance,
      complianceSuccesses: snapshot.complianceSuccesses,
      complianceWindowDays: snapshot.complianceDaysConsidered,
      level,
      levelInfo,
      model: {
        compliancePriorAlpha: COMPLIANCE_PRIOR_ALPHA,
        compliancePriorBeta: COMPLIANCE_PRIOR_BETA,
        complianceWindowDays: COMPLIANCE_WINDOW_DAYS,
        logisticMidpoint: LOGISTIC_MIDPOINT,
        logisticSlope: LOGISTIC_SLOPE,
      },
      predictionProbability: predictCompletionProbability(strength),
      strength,
      updatedAt:
        habit.strengthUpdatedAt ?? snapshot.lastEvaluatedDate.getTime(),
    };
  },
  returns: v.object({
    baseline: v.number(),
    compliance: v.number(),
    complianceSuccesses: v.number(),
    complianceWindowDays: v.number(),
    level: v.string(),
    levelInfo: v.object({
      color: v.string(),
      description: v.string(),
      emoji: v.string(),
      label: v.string(),
      level: v.string(),
    }),
    model: v.object({
      compliancePriorAlpha: v.number(),
      compliancePriorBeta: v.number(),
      complianceWindowDays: v.number(),
      logisticMidpoint: v.number(),
      logisticSlope: v.number(),
    }),
    predictionProbability: v.number(),
    strength: v.number(),
    updatedAt: v.optional(v.number()),
  }),
});

/**
 * Update habit strength parameters (for advanced users or experimentation)
 */
export const updateHabitParameters = mutation({
  args: {
    habitDecayParam: v.optional(v.number()),
    habitGainParam: v.optional(v.number()),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    // Validate parameters are in reasonable range
    if (
      args.habitDecayParam !== undefined &&
      (args.habitDecayParam < 0 || args.habitDecayParam > 1)
    ) {
      throw new Error('Habit decay parameter must be between 0 and 1');
    }

    if (
      args.habitGainParam !== undefined &&
      (args.habitGainParam < 0 || args.habitGainParam > 1)
    ) {
      throw new Error('Habit gain parameter must be between 0 and 1');
    }

    await ctx.db.patch(args.habitId, {
      habitDecayParam: args.habitDecayParam,
      habitGainParam: args.habitGainParam,
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Get strength statistics across all habits
 */
export const getAllHabitsStrengthStats = query({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    const stats = {
      averageStrength: 0,
      levelDistribution: {
        automatic: 0,
        building: 0,
        developing: 0,
        starting: 0,
        strong: 0,
      },
      strongestHabit: null as { name: string; strength: number } | null,
      totalHabits: habits.length,
      weakestHabit: null as { name: string; strength: number } | null,
    };

    if (habits.length === 0) return stats;

    let totalStrength = 0;
    let maxStrength = -1;
    let minStrength = 2;

    for (const habit of habits) {
      const strength = habit.strength ?? 0;
      totalStrength += strength;

      if (strength > maxStrength) {
        maxStrength = strength;
        stats.strongestHabit = { name: habit.name, strength };
      }

      if (strength < minStrength) {
        minStrength = strength;
        stats.weakestHabit = { name: habit.name, strength };
      }

      const level = habit.strengthLevel ?? getStrengthLevel(strength);
      stats.levelDistribution[level as StrengthLevel]++;
    }

    stats.averageStrength = totalStrength / habits.length;

    return stats;
  },
  returns: v.object({
    averageStrength: v.number(),
    levelDistribution: v.object({
      automatic: v.number(),
      building: v.number(),
      developing: v.number(),
      starting: v.number(),
      strong: v.number(),
    }),
    strongestHabit: v.union(
      v.null(),
      v.object({
        name: v.string(),
        strength: v.number(),
      })
    ),
    totalHabits: v.number(),
    weakestHabit: v.union(
      v.null(),
      v.object({
        name: v.string(),
        strength: v.number(),
      })
    ),
  }),
});
