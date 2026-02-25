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
  /** Number of habits completed today */
  completedToday?: number;
  /** Total number of habits */
  totalHabits?: number;
  /** Callback to jump back to today's week (shown when viewing past weeks) */
  onJumpToToday?: () => void;
  /** Trial bar: days remaining (renders inline gradient bar when > 0) */
  trialDaysRemaining?: number | null;
  /** Trial bar: upgrade callback */
  onUpgrade?: () => void;
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
  /** Whether to render a streak connector arm extending to the left */
  connectLeft?: boolean;
  /** Whether to render a streak connector arm extending to the right */
  connectRight?: boolean;
  /** Color for the streak connector arms */
  streakConnectorColor?: string;
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

export interface WeekNavigationHeaderProps {
  dateRangeText: string;
  /** Current date for day-name / full-date header display */
  currentDate: Date;
  canNavigateForward: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  completedToday?: number;
  totalHabits?: number;
}
