/** Completion status for a single day */
export interface DayCompletionStatus {
  /** Number of habits completed on this day */
  completed: number;
  /** Total number of habits for this day */
  total: number;
}

export interface CalendarTimelineProps {
  /** Array of dates to display in the timeline */
  dates: Date[];
  /** Callback for previous week navigation */
  onPreviousWeek?: () => void;
  /** Callback for next week navigation */
  onNextWeek?: () => void;
  /** Whether forward navigation is allowed */
  canNavigateForward?: boolean;
  /** Whether to show the gradient separator line */
  showSeparator?: boolean;
  /** Enables the high contrast theme */
  highContrastMode?: boolean;
  /** Currently selected date (reserved for future interactive states) */
  selectedDate?: Date;
  /** Callback when a date is selected (reserved for future interactive states) */
  onDateSelect?: (date: Date) => void;
  /** Completion status for each day (indexed by date string YYYY-MM-DD) */
  completionByDay?: Record<string, DayCompletionStatus>;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Callback when a day is tapped. Receives the date. */
  onDayPress?: (date: Date) => void;
  /** Whether day tapping is enabled (default: true when onDayPress provided) */
  isDayPressEnabled?: boolean;
  /** Disable tap on future dates (default: true) */
  disableFutureDayPress?: boolean;
}

export type CompletionStatus = 'complete' | 'partial' | 'none' | 'future';

export interface CompletionDotProps {
  status: CompletionStatus;
  reduceMotion?: boolean;
  isToday?: boolean;
}

export interface DayCellProps {
  date: Date;
  index: number;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionStatus: CompletionStatus;
  hasCompletionData: boolean;
  colors: CalendarColors;
  reduceMotion: boolean;
  onDayPress?: (date: Date) => void;
  isDayPressEnabled: boolean;
  disableFutureDayPress: boolean;
}

export interface CalendarColors {
  currentDayBackground: string;
  currentDayText: string;
  dayBackground: string;
  dayBorder: string;
  dayText: string;
  icon: string;
  primaryText: string;
  secondaryText: string;
}
