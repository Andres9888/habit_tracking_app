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
export const CONTEXT_CONSISTENCY = 1.0; // Cuet: Simplified to 1.0 (same context assumed)

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
const LOGISTIC_SLOPE = 0.07061188221043205; // Calibrated for ~22% at day 7
const LOGISTIC_MIDPOINT = 24.924269028255548;
const LOGISTIC_TARGET_DAY = 90;
const COMPLIANCE_WINDOW_DAYS = 30;
const COMPLIANCE_PRIOR_ALPHA = 1;
const COMPLIANCE_PRIOR_BETA = 1;

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
  const startDate =
    windowStartCandidate < creationDate ? creationDate : windowStartCandidate;

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

  if (daysConsidered === 0) {
    return {
      compliance:
        COMPLIANCE_PRIOR_ALPHA /
        (COMPLIANCE_PRIOR_ALPHA + COMPLIANCE_PRIOR_BETA),
      successes: 0,
      daysConsidered: 0,
    };
  }

  if (successes === daysConsidered) {
    return {
      compliance: 1,
      successes,
      daysConsidered,
    };
  }

  const compliance =
    (successes + COMPLIANCE_PRIOR_ALPHA) /
    (daysConsidered + COMPLIANCE_PRIOR_ALPHA + COMPLIANCE_PRIOR_BETA);

  return { compliance, successes, daysConsidered };
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
    habitCreatedAt,
    trackingMap,
    evaluationDate,
  });

  const strength = clamp(baseline * complianceStats.compliance, 0, 1);

  return {
    strength,
    strengthLevel: getStrengthLevel(strength),
    baseline,
    compliance: complianceStats.compliance,
    complianceSuccesses: complianceStats.successes,
    complianceDaysConsidered: complianceStats.daysConsidered,
    daysSinceCreation,
    lastEvaluatedDate: evaluationDate,
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
  starting: {
    level: 'starting',
    emoji: '🌱',
    label: 'Starting Out',
    description: 'Just beginning - stay focused!',
    color: '#86efac', // green-300
  },
  building: {
    level: 'building',
    emoji: '🌿',
    label: 'Building',
    description: 'Making progress - keep it up!',
    color: '#4ade80', // green-400
  },
  developing: {
    level: 'developing',
    emoji: '🌳',
    label: 'Developing',
    description: 'Getting stronger each day!',
    color: '#22c55e', // green-500
  },
  strong: {
    level: 'strong',
    emoji: '💪',
    label: 'Strong',
    description: 'Habit is well-established!',
    color: '#16a34a', // green-600
  },
  automatic: {
    level: 'automatic',
    emoji: '⚡',
    label: 'Automatic',
    description: 'Fully automatic - amazing!',
    color: '#15803d', // green-700
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
 */
export function getStrengthLevel(strength: number): StrengthLevel {
  if (strength < 0.2) return 'starting';
  if (strength < 0.4) return 'building';
  if (strength < 0.6) return 'developing';
  if (strength < 0.8) return 'strong';
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
  accessibility: number = 1.0
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
 */
export const updateHabitStrength = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
    behaviorPerformed: v.boolean(),
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

      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      const snapshot = generateHabitStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        tracking: tracking.map((t) => ({
          date: t.date,
          completed: t.completed,
        })),
        throughDate: startOfDay(new Date()),
      });

      // Determine strength level
      const { strength: newStrength, strengthLevel } = snapshot;

      console.log('🔧 Updating habit strength (replay):', {
        habitName: habit.name,
        date: args.date,
        behaviorPerformed: args.behaviorPerformed,
        previousStrength: (previousStrength * 100).toFixed(1) + '%',
        newStrength: (newStrength * 100).toFixed(1) + '%',
        baseline: (snapshot.baseline * 100).toFixed(1) + '%',
        compliance: (snapshot.compliance * 100).toFixed(1) + '%',
        strengthLevel,
        windowDays: snapshot.complianceDaysConsidered,
        successes: snapshot.complianceSuccesses,
      });

      // Update habit
      await ctx.db.patch(args.habitId, {
        strength: newStrength,
        strengthLevel,
        strengthUpdatedAt: snapshot.lastEvaluatedDate.getTime(),
      });

      return {
        previousStrength,
        newStrength,
        strengthLevel,
        baseline: snapshot.baseline,
        compliance: snapshot.compliance,
        daysSinceCreation: snapshot.daysSinceCreation,
        predictionProbability: predictCompletionProbability(newStrength),
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
    previousStrength: v.number(),
    newStrength: v.number(),
    strengthLevel: v.string(),
    baseline: v.number(),
    compliance: v.number(),
    daysSinceCreation: v.number(),
    predictionProbability: v.number(),
  }),
});

/**
 * Recalculate habit strength for all past tracking data
 * Useful for initializing strength for existing habits or after parameter changes
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

      console.log('🔄 Recalculating strength for:', habit.name);

      // Get all tracking data for this habit
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      console.log(`  ▸ Found ${tracking.length} tracking entries`);

      const snapshot = generateHabitStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        tracking: tracking.map((t) => ({
          date: t.date,
          completed: t.completed,
        })),
        throughDate: startOfDay(new Date()),
      });

      console.log(
        `  ✅ Calculated: strength=${(snapshot.strength * 100).toFixed(
          1
        )}%, baseline=${(snapshot.baseline * 100).toFixed(1)}%, compliance=${(
          snapshot.compliance * 100
        ).toFixed(
          1
        )}%, level=${snapshot.strengthLevel}, window=${snapshot.complianceDaysConsidered}d`
      );

      // Update habit with final strength
      await ctx.db.patch(args.habitId, {
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: snapshot.lastEvaluatedDate.getTime(),
      });

      return {
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        daysProcessed: snapshot.complianceDaysConsidered,
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
    strength: v.number(),
    strengthLevel: v.string(),
    daysProcessed: v.number(),
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
      tracking: tracking.map((t) => ({
        date: t.date,
        completed: t.completed,
      })),
      throughDate: startOfDay(new Date()),
    });

    const strength = habit.strength ?? snapshot.strength;
    const level = habit.strengthLevel ?? snapshot.strengthLevel;
    const levelInfo = STRENGTH_LEVELS[level as StrengthLevel];

    return {
      strength,
      level,
      levelInfo,
      baseline: snapshot.baseline,
      compliance: snapshot.compliance,
      complianceWindowDays: snapshot.complianceDaysConsidered,
      complianceSuccesses: snapshot.complianceSuccesses,
      predictionProbability: predictCompletionProbability(strength),
      updatedAt:
        habit.strengthUpdatedAt ?? snapshot.lastEvaluatedDate.getTime(),
      model: {
        logisticSlope: LOGISTIC_SLOPE,
        logisticMidpoint: LOGISTIC_MIDPOINT,
        complianceWindowDays: COMPLIANCE_WINDOW_DAYS,
        compliancePriorAlpha: COMPLIANCE_PRIOR_ALPHA,
        compliancePriorBeta: COMPLIANCE_PRIOR_BETA,
      },
    };
  },
  returns: v.object({
    strength: v.number(),
    level: v.string(),
    levelInfo: v.object({
      level: v.string(),
      emoji: v.string(),
      label: v.string(),
      description: v.string(),
      color: v.string(),
    }),
    baseline: v.number(),
    compliance: v.number(),
    complianceWindowDays: v.number(),
    complianceSuccesses: v.number(),
    predictionProbability: v.number(),
    updatedAt: v.optional(v.number()),
    model: v.object({
      logisticSlope: v.number(),
      logisticMidpoint: v.number(),
      complianceWindowDays: v.number(),
      compliancePriorAlpha: v.number(),
      compliancePriorBeta: v.number(),
    }),
  }),
});

/**
 * Update habit strength parameters (for advanced users or experimentation)
 */
export const updateHabitParameters = mutation({
  args: {
    habitId: v.id('habits'),
    habitDecayParam: v.optional(v.number()),
    habitGainParam: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    // Validate parameters are in reasonable range
    if (args.habitDecayParam !== undefined) {
      if (args.habitDecayParam < 0 || args.habitDecayParam > 1) {
        throw new Error('Habit decay parameter must be between 0 and 1');
      }
    }

    if (args.habitGainParam !== undefined) {
      if (args.habitGainParam < 0 || args.habitGainParam > 1) {
        throw new Error('Habit gain parameter must be between 0 and 1');
      }
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
      totalHabits: habits.length,
      averageStrength: 0,
      strongestHabit: null as { name: string; strength: number } | null,
      weakestHabit: null as { name: string; strength: number } | null,
      levelDistribution: {
        starting: 0,
        building: 0,
        developing: 0,
        strong: 0,
        automatic: 0,
      },
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
    totalHabits: v.number(),
    averageStrength: v.number(),
    strongestHabit: v.union(
      v.null(),
      v.object({
        name: v.string(),
        strength: v.number(),
      })
    ),
    weakestHabit: v.union(
      v.null(),
      v.object({
        name: v.string(),
        strength: v.number(),
      })
    ),
    levelDistribution: v.object({
      starting: v.number(),
      building: v.number(),
      developing: v.number(),
      strong: v.number(),
      automatic: v.number(),
    }),
  }),
});
