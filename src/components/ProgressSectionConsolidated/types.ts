/**
 * ProgressSectionConsolidated Types
 *
 * Type definitions for the consolidated progress section components.
 * This redesigned component merges YourProgressCard, PersonalBestsCard,
 * and ThisMonthCard into a single unified component with better visual hierarchy.
 */

import type { HabitTrackingEntry } from '../../features/habits/types';

// Re-export shared types from existing ProgressSection
export type {
  DayStats,
  StreakRecord,
  LevelConfig,
  TrendComparison,
} from '../ProgressSection/types';

/**
 * Props for the main ProgressSectionConsolidated container
 */
export interface ProgressSectionConsolidatedProps {
  /** Habit tracking entries */
  tracking: HabitTrackingEntry[];
  /** Timestamp when habit was created (ISO string) */
  habitCreatedAt: string;
  /** Current habit strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
  /** Callback when focus day chip is pressed */
  onFocusDayPress?: () => void;
  /** Callback when "See All" is pressed in weekly pattern section */
  onSeeAllPress?: () => void;
  /** Callback when actionable tip is pressed (legacy) */
  onTipPress?: () => void;
  /** Callback when a quick action is selected from the tip card */
  onTipQuickAction?: (
    action: import('./TipQuickActionsSheetTypes').QuickAction
  ) => void;
}

/**
 * Props for HeroStrengthSection component
 * Displays the main progress ring with level info and trend indicator
 */
export interface HeroStrengthSectionProps {
  /** Current strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}

/**
 * Insight chip data structure
 */
export interface InsightChipData {
  /** Unique identifier for the chip */
  id: 'streak' | 'bestDay' | 'focusDay' | 'monthly';
  /** Emoji icon to display */
  icon: string;
  /** Primary value (e.g., "6 days", "Sunday", "6/22") */
  value: string;
  /** Secondary label text */
  label: string;
  /** Border color class name */
  borderColor: string;
  /** Whether to show pulse animation (for active streak) */
  hasPulse?: boolean;
  /** Whether the chip is interactive */
  isInteractive?: boolean;
  /** Optional callback when tapped */
  onPress?: () => void;
}

/**
 * Props for InsightChips component
 * Horizontal scroll container with key insight chips
 */
export interface InsightChipsProps {
  /** Current streak in days */
  currentStreak: number;
  /** Best performing day name and rate */
  bestDay: { name: string; rate: number } | null;
  /** Worst performing day (focus day) name and rate */
  focusDay: { name: string; rate: number } | null;
  /** Days completed this month */
  monthlyCompleted: number;
  /** Total days in the month so far */
  monthlyTotal: number;
  /** Callback when focus day chip is pressed */
  onFocusDayPress?: () => void;
}

/**
 * Props for WeeklyPatternChart component
 * Compact 7-day bar chart showing completion patterns
 */
export interface WeeklyPatternChartProps {
  /** Statistics for each day of the week */
  dayStats: Array<{
    day: string;
    dayIndex: number;
    completed: number;
    total: number;
    rate: number;
  }>;
  /** Callback when "Details" button is pressed */
  onSeeAllPress?: () => void;
}

/**
 * Props for ActionableTipCard component
 * CTA section with personalized tip
 */
export interface ActionableTipCardProps {
  /** Tip message text */
  tip: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Current streak for determining tip type */
  currentStreak?: number;
  /** Callback when tip card is pressed */
  onPress?: () => void;
  /** Callback when a quick action is selected from the sheet */
  onQuickAction?: (
    action: import('./TipQuickActionsSheetTypes').QuickAction
  ) => void;
}

/**
 * Props for StreakRecordsAccordion component
 * Collapsible section showing streak medal records
 */
export interface StreakRecordsAccordionProps {
  /** Top streak records (medals) */
  streakRecords: Array<{
    days: number;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }>;
  /** Current active streak (0 if none) */
  currentStreak: number;
  /** Default expanded state */
  defaultExpanded?: boolean;
}

/**
 * Level thresholds configuration for habit strength display
 */
export interface LevelThreshold {
  /** Minimum strength value for this level (inclusive) */
  min: number;
  /** Maximum strength value for this level (exclusive) */
  max: number;
  /** Display label for the level */
  label: string;
  /** Emoji representing the level */
  emoji: string;
  /** Primary color for the level */
  color: string;
  /** Light background color for badges */
  bgColor: string;
  /** Description of what this level means */
  description: string;
}

/**
 * Constants for level thresholds
 */
export const STRENGTH_LEVELS: LevelThreshold[] = [
  {
    // lime-600
    bgColor: '#ecfccb',

    color: '#65a30d',

    // lime-100
    description: 'Just getting started',

    emoji: '🌱',

    label: 'Starting Out',

    max: 20,
    min: 0,
  },
  {
    // green-600
    bgColor: '#dcfce7',

    color: '#16a34a',

    // green-100
    description: 'Building momentum',

    emoji: '🌿',

    label: 'Building',

    max: 40,
    min: 20,
  },
  {
    // emerald-600
    bgColor: '#d1fae5',

    color: '#059669',

    // emerald-100
    description: 'Habit is taking root',

    emoji: '🌳',

    label: 'Growing',

    max: 60,
    min: 40,
  },
  {
    // cyan-600
    bgColor: '#cffafe',

    color: '#0891b2',

    // cyan-100
    description: 'Solid consistency',

    emoji: '💪',

    label: 'Strong',

    max: 80,
    min: 60,
  },
  {
    // violet-600
    bgColor: '#ede9fe',

    color: '#7c3aed',

    // violet-100
    description: 'Habit mastery achieved',

    emoji: '⚡',

    label: 'Unbreakable',

    max: 101,
    min: 80,
  },
];

/**
 * Helper function to get level info from strength value
 */
export function getLevelFromStrength(strength: number): LevelThreshold {
  const level = STRENGTH_LEVELS.find(
    (l) => strength >= l.min && strength < l.max
  );
  return level || STRENGTH_LEVELS[0];
}

/**
 * Helper function to get progress to next level
 */
export function getProgressToNextLevel(strength: number): {
  currentLevel: LevelThreshold;
  nextLevel: LevelThreshold | null;
  progressPercent: number;
  pointsToNext: number;
} {
  const currentLevel = getLevelFromStrength(strength);
  const currentIndex = STRENGTH_LEVELS.indexOf(currentLevel);
  const nextLevel =
    currentIndex < STRENGTH_LEVELS.length - 1
      ? STRENGTH_LEVELS[currentIndex + 1]
      : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      pointsToNext: 0,
      progressPercent: 100,
    };
  }

  const rangeSize = currentLevel.max - currentLevel.min;
  const progressInLevel = strength - currentLevel.min;
  const progressPercent = Math.round((progressInLevel / rangeSize) * 100);
  const pointsToNext = currentLevel.max - strength;

  return {
    currentLevel,
    nextLevel,
    pointsToNext,
    progressPercent,
  };
}
