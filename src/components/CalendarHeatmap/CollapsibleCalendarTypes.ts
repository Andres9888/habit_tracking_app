/**
 * TypeScript Interfaces for CollapsibleCalendar Component
 */

import type { Id } from '../../../convex/_generated/dataModel';

/**
 * Props for CollapsibleCalendar wrapper component
 */
export interface CollapsibleCalendarProps {
  /** Habit ID for context and preference persistence */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (to show tracking start) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor?: string;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Whether to start in expanded state (default: false) */
  defaultExpanded?: boolean;

  /** Whether to show mini 7-day preview when collapsed */
  showMiniPreview?: boolean;

  /** Whether to show theme picker button (default: true) */
  showThemeButton?: boolean;
}

/**
 * Mini preview dot visual state
 */
export type MiniPreviewDotState =
  | 'complete'
  | 'missed'
  | 'todayComplete'
  | 'todayIncomplete'
  | 'future';

/**
 * Data for a single mini preview dot
 */
export interface MiniPreviewDot {
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Visual state of the dot */
  state: MiniPreviewDotState;
}
