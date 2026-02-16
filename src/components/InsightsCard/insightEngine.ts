/**
 * Insight Engine
 *
 * Generates actionable, contextual insights from habit tracking data.
 * Each insight type analyzes patterns and produces human-readable messages.
 */

import { format, parseISO, differenceInCalendarDays, addDays } from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InsightType =
  | 'streak_break'
  | 'best_day_pattern'
  | 'historical_benchmark'
  | 'streak_prediction'
  | 'weekly_focus';

export interface Insight {
  type: InsightType;
  emoji: string;
  title: string;
  message: string;
  /** 0–1 priority for ordering (higher = more relevant right now) */
  priority: number;
}

interface TrackingEntry {
  date: string;
  completed: boolean;
  habitId: string;
}

interface InsightInput {
  tracking: TrackingEntry[];
  habitName: string;
  currentStreak: number;
  habitCreatedAt?: number;
}

// ---------------------------------------------------------------------------
// Day names
// ---------------------------------------------------------------------------

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function completedDatesSet(tracking: TrackingEntry[]): Set<string> {
  return new Set(tracking.filter((t) => t.completed).map((t) => t.date));
}

function completedDatesArray(tracking: TrackingEntry[]): string[] {
  return Array.from(completedDatesSet(tracking));
}

function allTrackedDates(tracking: TrackingEntry[]): string[] {
  return Array.from(new Set(tracking.map((t) => t.date))).sort();
}

// ---------------------------------------------------------------------------
// 1. Streak Break Analysis
// ---------------------------------------------------------------------------

function streakBreakInsight(input: InsightInput): Insight | null {
  const { tracking, habitName, currentStreak } = input;
  if (currentStreak > 0) return null; // no break to analyze

  const completed = Array.from(completedDatesSet(tracking)).sort();
  if (completed.length === 0) return null;

  const lastCompleted = completed[completed.length - 1];
  const today = todayStr();
  const daysSince = differenceInCalendarDays(
    parseISO(today),
    parseISO(lastCompleted)
  );

  if (daysSince <= 1) return null; // streak is actually active

  // Find what the streak was before the break
  let prevStreak = 1;
  for (let i = completed.length - 2; i >= 0; i--) {
    const diff = differenceInCalendarDays(
      parseISO(completed[i + 1]),
      parseISO(completed[i])
    );
    if (diff === 1) {
      prevStreak++;
    } else {
      break;
    }
  }

  const breakDate = format(
    addDays(parseISO(lastCompleted), 1),
    'MMM d'
  );

  const daysAgoText =
    daysSince === 2
      ? 'yesterday'
      : daysSince <= 7
        ? `${daysSince} days ago`
        : `on ${breakDate}`;

  return {
    emoji: '🔍',
    message:
      prevStreak >= 3
        ? `You had a ${prevStreak}-day streak on ${habitName} but missed ${daysAgoText}. One day off doesn't erase progress — jump back in today!`
        : `You last completed ${habitName} ${daysAgoText}. Today is a fresh start!`,
    priority: 0.95, // Very relevant when streak is broken
    title: 'Streak Break Analysis',
    type: 'streak_break',
  };
}

// ---------------------------------------------------------------------------
// 2. Best Day Pattern (Predictive)
// ---------------------------------------------------------------------------

function bestDayPatternInsight(input: InsightInput): Insight | null {
  const { tracking, habitName } = input;
  const completed = completedDatesSet(tracking);
  if (completed.size < 7) return null;

  // Count completions by day of week
  const dayCounts = new Array(7).fill(0);
  const dayTotals = new Array(7).fill(0);

  const dates = allTrackedDates(tracking);
  for (const d of dates) {
    const dow = parseISO(d).getDay();
    dayTotals[dow]++;
    if (completed.has(d)) {
      dayCounts[dow]++;
    }
  }

  // Find best and worst days with enough data
  let bestIdx = -1;
  let bestRate = -1;
  let worstIdx = -1;
  let worstRate = 101;

  for (let i = 0; i < 7; i++) {
    if (dayTotals[i] < 2) continue;
    const rate = (dayCounts[i] / dayTotals[i]) * 100;
    if (rate > bestRate) {
      bestRate = rate;
      bestIdx = i;
    }
    if (rate < worstRate) {
      worstRate = rate;
      worstIdx = i;
    }
  }

  if (bestIdx === -1) return null;

  const todayDow = new Date().getDay();
  const isBestToday = todayDow === bestIdx;

  return {
    emoji: '📊',
    message: isBestToday
      ? `Today (${DAY_NAMES[bestIdx]}) is your best day for ${habitName} at ${Math.round(bestRate)}% completion. Don't break the pattern!`
      : `You complete ${habitName} best on ${DAY_NAMES[bestIdx]}s (${Math.round(bestRate)}%). ${worstIdx >= 0 && worstRate < 50 ? `Watch out for ${DAY_NAMES[worstIdx]}s (${Math.round(worstRate)}%).` : 'Keep it up!'}`,
    priority: isBestToday ? 0.85 : 0.6,
    title: 'Your Pattern',
    type: 'best_day_pattern',
  };
}

// ---------------------------------------------------------------------------
// 3. Historical Benchmarking
// ---------------------------------------------------------------------------

function historicalBenchmarkInsight(input: InsightInput): Insight | null {
  const { tracking, currentStreak } = input;
  const completed = Array.from(completedDatesSet(tracking)).sort();
  if (completed.length < 5) return null;

  // Calculate best streak ever
  let bestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < completed.length; i++) {
    const diff = differenceInCalendarDays(
      parseISO(completed[i]),
      parseISO(completed[i - 1])
    );
    if (diff === 1) {
      currentRun++;
      if (currentRun > bestStreak) bestStreak = currentRun;
    } else {
      currentRun = 1;
    }
  }

  if (bestStreak < 3) return null;

  if (currentStreak === 0) {
    return {
      emoji: '🏆',
      message: `Your personal best is ${bestStreak} days. Start today to begin chasing it!`,
      priority: 0.5,
      title: 'Personal Best',
      type: 'historical_benchmark',
    };
  }

  const pct = Math.round((currentStreak / bestStreak) * 100);

  if (currentStreak >= bestStreak) {
    return {
      emoji: '🎉',
      message: `You're at your ALL-TIME BEST — ${currentStreak} days! Every day is a new record!`,
      priority: 1.0,
      title: 'New Record!',
      type: 'historical_benchmark',
    };
  }

  return {
    emoji: '🏆',
    message: `Your best streak was ${bestStreak} days. You're currently at ${currentStreak} (${pct}% of your best). ${bestStreak - currentStreak} more days to beat it!`,
    priority: pct > 60 ? 0.8 : 0.5,
    title: 'Personal Best',
    type: 'historical_benchmark',
  };
}

// ---------------------------------------------------------------------------
// 4. Streak Prediction
// ---------------------------------------------------------------------------

function streakPredictionInsight(input: InsightInput): Insight | null {
  const { tracking, currentStreak } = input;
  if (currentStreak < 3) return null;

  const completed = completedDatesSet(tracking);
  const dates = allTrackedDates(tracking);
  if (dates.length < 14) return null;

  // Calculate recent completion rate (last 30 days)
  const today = new Date();
  let recentCompleted = 0;
  let recentTotal = 0;
  for (let i = 0; i < 30; i++) {
    const d = format(addDays(today, -i), 'yyyy-MM-dd');
    if (dates.includes(d) || completed.has(d)) {
      recentTotal++;
      if (completed.has(d)) recentCompleted++;
    }
  }

  if (recentTotal < 7) return null;
  const completionRate = recentCompleted / recentTotal;
  if (completionRate < 0.5) return null;

  // Predict days until milestone streaks
  const milestones = [7, 14, 21, 30, 50, 66, 100];
  const nextMilestone = milestones.find((m) => m > currentStreak);
  if (!nextMilestone) return null;

  const daysNeeded = nextMilestone - currentStreak;
  // Estimate based on completion rate - expected days to accumulate needed consecutive days
  const estimatedDays = Math.ceil(daysNeeded / completionRate);
  const predictedDate = format(addDays(today, estimatedDays), 'MMM d');

  return {
    emoji: '🔮',
    message: `At your current pace (${Math.round(completionRate * 100)}%), you could hit a ${nextMilestone}-day streak by ${predictedDate}. Keep going!`,
    priority: 0.7,
    title: 'Streak Forecast',
    type: 'streak_prediction',
  };
}

// ---------------------------------------------------------------------------
// 5. Weekly Focus Area
// ---------------------------------------------------------------------------

function weeklyFocusInsight(input: InsightInput): Insight | null {
  const { tracking, habitName, habitCreatedAt } = input;
  const completed = completedDatesSet(tracking);
  if (completed.size < 7) return null;

  const today = new Date();

  // This week's rate
  let thisWeekDone = 0;
  let thisWeekTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = format(addDays(today, -i), 'yyyy-MM-dd');
    thisWeekTotal++;
    if (completed.has(d)) thisWeekDone++;
  }

  // Last week's rate
  let lastWeekDone = 0;
  let lastWeekTotal = 0;
  for (let i = 7; i < 14; i++) {
    const d = format(addDays(today, -i), 'yyyy-MM-dd');
    lastWeekTotal++;
    if (completed.has(d)) lastWeekDone++;
  }

  const thisWeekRate = thisWeekTotal > 0 ? thisWeekDone / thisWeekTotal : 0;
  const lastWeekRate = lastWeekTotal > 0 ? lastWeekDone / lastWeekTotal : 0;

  if (lastWeekRate === 0 && thisWeekRate === 0) return null;

  const improvement = Math.round((thisWeekRate - lastWeekRate) * 100);
  const improvementPotential = Math.round((1 - thisWeekRate) * 100);

  if (thisWeekRate >= 0.85) {
    return {
      emoji: '🌟',
      message: `${habitName} is on fire this week — ${Math.round(thisWeekRate * 100)}% completion! Maintain this momentum.`,
      priority: 0.65,
      title: 'This Week',
      type: 'weekly_focus',
    };
  }

  if (improvement > 15) {
    return {
      emoji: '📈',
      message: `Great progress! ${habitName} is up ${improvement}% from last week (${Math.round(lastWeekRate * 100)}% → ${Math.round(thisWeekRate * 100)}%).`,
      priority: 0.7,
      title: 'Trending Up',
      type: 'weekly_focus',
    };
  }

  if (improvement < -15) {
    return {
      emoji: '⚡',
      message: `${habitName} dipped ${Math.abs(improvement)}% this week. ${7 - thisWeekDone} days left to turn it around!`,
      priority: 0.75,
      title: 'Needs Attention',
      type: 'weekly_focus',
    };
  }

  if (improvementPotential > 30) {
    return {
      emoji: '🎯',
      message: `This week's focus: ${habitName} with ${improvementPotential}% room to grow. ${7 - thisWeekDone} completions needed for a perfect week!`,
      priority: 0.55,
      title: 'Weekly Focus',
      type: 'weekly_focus',
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const GENERATORS = [
  streakBreakInsight,
  bestDayPatternInsight,
  historicalBenchmarkInsight,
  streakPredictionInsight,
  weeklyFocusInsight,
];

/**
 * Generate all applicable insights for a habit, sorted by priority.
 */
export function generateInsights(input: InsightInput): Insight[] {
  return GENERATORS.map((gen) => gen(input))
    .filter((insight): insight is Insight => insight !== null)
    .sort((a, b) => b.priority - a.priority);
}
