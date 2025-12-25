/**
 * WeeklySummaryStrip Types
 *
 * Type definitions for the Weekly Summary Strip component.
 * This component provides a visual 7-day view of the current week's progress.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

/**
 * Data for a single day in the week
 */
export interface WeekDayData {
  /** Date string in ISO format (YYYY-MM-DD) */
  date: string;

  /** Whether the habit was completed on this day */
  completed: boolean;

  /** Whether this is today */
  isToday: boolean;
}

/**
 * Visual state for a day cell
 *
 * - complete: Habit was completed (emerald background with check)
 * - missed: Day has passed without completion (stone background with X)
 * - todayIncomplete: Today, not yet completed (amber dashed border, pulsing)
 * - todayComplete: Today, completed (emerald with ring highlight)
 * - future: Day hasn't happened yet (gray, no icon)
 */
export type DayVisualState =
  | 'complete'
  | 'missed'
  | 'todayIncomplete'
  | 'todayComplete'
  | 'future';

/**
 * Trend direction for week-over-week comparison
 */
export type TrendDirection = 'up' | 'down' | 'same';

/**
 * Props for WeeklySummaryStrip component
 *
 * @example
 * ```tsx
 * <WeeklySummaryStrip
 *   weekData={[
 *     { date: '2024-01-15', completed: true, isToday: false },
 *     { date: '2024-01-16', completed: true, isToday: false },
 *     { date: '2024-01-17', completed: false, isToday: false },
 *     { date: '2024-01-18', completed: true, isToday: false },
 *     { date: '2024-01-19', completed: true, isToday: false },
 *     { date: '2024-01-20', completed: true, isToday: false },
 *     { date: '2024-01-21', completed: false, isToday: true },
 *   ]}
 *   lastWeekCompleted={5}
 *   onTodayPress={() => console.log('Quick complete')}
 * />
 * ```
 */
export interface WeeklySummaryStripProps {
  /** Array of 7 days representing the current week (Monday to Sunday) */
  weekData: WeekDayData[];

  /** Number of days completed last week (0-7), for trend comparison */
  lastWeekCompleted: number;

  /** Optional callback when today's cell is pressed (for quick complete) */
  onTodayPress?: () => void;
}

/**
 * Day abbreviations for display (Monday to Sunday)
 */
export const DAY_ABBREVIATIONS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * Full day names for accessibility
 */
export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Configuration for each day visual state
 */
export interface DayStateConfig {
  /** Background color */
  backgroundColor: string;
  /** Border color (for dashed borders) */
  borderColor: string;
  /** Border style */
  borderStyle: 'solid' | 'dashed';
  /** Border width */
  borderWidth: number;
  /** Icon name (Ionicons) */
  icon: string | null;
  /** Icon color */
  iconColor: string;
  /** Whether to show pulsing animation */
  hasPulse: boolean;
  /** Whether to show ring highlight */
  hasRing: boolean;
  /** Ring color (if hasRing is true) */
  ringColor: string;
  /** Text to display instead of icon (e.g., "Today") */
  text: string | null;
  /** Text color */
  textColor: string;
}

/**
 * Visual state configurations for each day state
 */
export const DAY_STATE_CONFIGS: Record<DayVisualState, DayStateConfig> = {
  complete: {
    backgroundColor: '#10b981', // emerald-500
    borderColor: '#10b981',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: false,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: 'transparent',
    text: null,
    textColor: '#ffffff',
  },
  future: {
    backgroundColor: '#f5f5f4', // stone-100
    borderColor: '#e7e5e4', // stone-200
    borderStyle: 'solid',
    borderWidth: 1,
    // stone-400
    hasPulse: false,

    hasRing: false,
    icon: null,
    iconColor: '#a8a29e',
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c', // stone-500
  },
  missed: {
    backgroundColor: '#e7e5e4', // stone-200
    borderColor: '#d6d3d1', // stone-300
    borderStyle: 'solid',
    borderWidth: 0,
    // stone-400
    hasPulse: false,

    hasRing: false,
    icon: 'close',
    iconColor: '#a8a29e',
    ringColor: 'transparent',
    text: null,
    textColor: '#78716c', // stone-500
  },
  todayComplete: {
    backgroundColor: '#10b981', // emerald-500
    borderColor: '#10b981',
    borderStyle: 'solid',
    borderWidth: 0,
    hasPulse: false,
    hasRing: true,
    icon: 'checkmark',
    iconColor: '#ffffff',
    ringColor: '#6ee7b7', // emerald-300
    text: null,
    textColor: '#ffffff',
  },
  todayIncomplete: {
    backgroundColor: '#fef3c7', // amber-100
    borderColor: '#fbbf24', // amber-400
    borderStyle: 'dashed',
    borderWidth: 2,
    // amber-600
    hasPulse: true,

    hasRing: false,
    icon: null,
    iconColor: '#d97706',
    ringColor: 'transparent',
    text: 'Today',
    textColor: '#d97706', // amber-600
  },
};
