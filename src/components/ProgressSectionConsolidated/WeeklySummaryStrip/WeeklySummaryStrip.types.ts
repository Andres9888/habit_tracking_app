/**
 * WeeklySummaryStrip Types
 *
 * Type definitions for the Weekly Summary Strip component.
 */

import type { LucideIcon } from 'lucide-react-native';

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
 * Configuration for each day visual state
 */
export interface DayStateConfig {
  backgroundColor: string;
  borderColor: string;
  borderStyle: 'solid' | 'dashed';
  borderWidth: number;
  icon: LucideIcon | null;
  iconColor: string;
  hasPulse: boolean;
  hasRing: boolean;
  ringColor: string;
  text: string | null;
  textColor: string;
}
