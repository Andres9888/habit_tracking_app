/**
 * Type definitions for StatCardGenerator component
 *
 * Stat cards are shareable images showing aggregated habit statistics,
 * distinct from milestone cards (ShareCardGenerator) which celebrate a
 * single habit achievement.
 */

// ---------------------------------------------------------------------------
// Card type: which stat snapshot to render
// ---------------------------------------------------------------------------

/** The three stat card templates available. */
export type StatCardType = 'streak-30day' | 'monthly-recap' | 'year-in-review';

/** Visual style variant applied to any card type. */
export type StatCardVariant = 'minimal' | 'bold' | 'dark';

// ---------------------------------------------------------------------------
// Data shapes for each card type
// ---------------------------------------------------------------------------

export interface TopHabitStreak {
  name: string;
  emoji: string;
  currentStreak: number;
}

/** Data driving the "30 Day Streak 🔥" card. */
export interface StreakCardData {
  /** Longest current streak across all habits (days). */
  bestStreak: number;
  /** Name of the habit with the best current streak. */
  bestHabitName: string;
  /** Emoji icon for the best-streak habit. */
  bestHabitEmoji: string;
  /** Up to three habits to display as a leaderboard. */
  topHabits: TopHabitStreak[];
  /** How many habits have a streak > 0. */
  activeStreakCount: number;
  /** Progress toward the 66-day habit-formation milestone (0–100). */
  formationProgress: number;
}

/** Data driving the "Monthly Recap" card. */
export interface MonthlyRecapCardData {
  /** Human-readable month name (e.g. "February 2026"). */
  monthLabel: string;
  /** Overall completion rate for the month (0–100). */
  completionRate: number;
  /** Total habit completions logged this month. */
  totalCompletions: number;
  /** Maximum possible completions (habits × days active). */
  totalPossible: number;
  /** Number of perfect days (100 % completion). */
  perfectDays: number;
  /** Day-of-week with the highest average (0 = Sunday). */
  bestDayOfWeek: string;
  /** Number of active habits tracked this month. */
  habitCount: number;
}

/** Data driving the "Year in Review" card. */
export interface YearInReviewCardData {
  /** Four-digit year (e.g. 2025). */
  year: number;
  /** Total distinct days with at least one check-in. */
  daysTracked: number;
  /** Total individual habit completions across the year. */
  totalCompletions: number;
  /** Number of habits that reached ≥ 60 % strength ("formed"). */
  habitsFormed: number;
  /** Average daily completion rate across all tracked days (0–100). */
  averageCompletionRate: number;
  /** Longest streak achieved by any habit during the year (days). */
  longestStreak: number;
  /** Name of the habit that achieved the longest streak. */
  longestStreakHabit: string;
}

// ---------------------------------------------------------------------------
// Union type for passing data into StatCardGenerator
// ---------------------------------------------------------------------------

export type StatCardData =
  | { type: 'streak-30day'; data: StreakCardData }
  | { type: 'monthly-recap'; data: MonthlyRecapCardData }
  | { type: 'year-in-review'; data: YearInReviewCardData };

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface StatCardGeneratorProps {
  visible: boolean;
  onClose: () => void;
  /** Pre-computed stats provided by the parent screen. */
  streakData: StreakCardData;
  monthlyData: MonthlyRecapCardData;
  yearData: YearInReviewCardData;
  /** Optional: logged-in user display name. */
  userName?: string;
}

// ---------------------------------------------------------------------------
// Internal hook return / state
// ---------------------------------------------------------------------------

export interface StatCardState {
  selectedType: StatCardType;
  selectedVariant: StatCardVariant;
  isGenerating: boolean;
}

// ---------------------------------------------------------------------------
// Card-type metadata shown in the picker
// ---------------------------------------------------------------------------

export interface CardTypeConfig {
  type: StatCardType;
  label: string;
  emoji: string;
  description: string;
}

export interface VariantConfig {
  variant: StatCardVariant;
  label: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Props passed into each individual card component
// ---------------------------------------------------------------------------

export interface BaseCardProps {
  variant: StatCardVariant;
  userName?: string;
}

export interface StreakCardProps extends BaseCardProps {
  data: StreakCardData;
}

export interface MonthlyRecapCardProps extends BaseCardProps {
  data: MonthlyRecapCardData;
}

export interface YearInReviewCardProps extends BaseCardProps {
  data: YearInReviewCardData;
}
