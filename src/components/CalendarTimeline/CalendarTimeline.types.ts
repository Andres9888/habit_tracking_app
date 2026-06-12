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
  /** Best current streak across all habits (for greeting display) */
  currentStreak?: number;
  /** Overall habit-strength percent (0–100). Drives the material tier. */
  strengthPercent?: number;
  /** Trial bar: days remaining (renders inline gradient bar when > 0) */
  trialDaysRemaining?: number | null;
  /** Trial bar: upgrade callback */
  onUpgrade?: () => void;
  /** Completion icon style — 'chain' shows link icon, 'checkbox' shows checkmark */
  completionIcon?: 'chain' | 'checkbox';
  /** Compact mode — tighter vertical padding to match compact habit cards */
  compact?: boolean;
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
  /** Number of habits completed on this day */
  completed: number;
  /** Total number of habits for this day */
  total: number;
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
  /** Ghost connector on left — chain "waiting" (Zeigarnik effect) */
  ghostLeft?: boolean;
  /** Ghost connector on right — reaching toward today */
  ghostRight?: boolean;
  /** Color for ghost connectors (distinct from active) */
  ghostConnectorColor?: string;
  /** Current streak length — drives connector strength evolution */
  currentStreak?: number;
  /** Overall habit-strength percent (0–100). Drives the material tier. */
  strengthPercent?: number;
  /** Completion icon style for the ring */
  completionIcon?: 'chain' | 'checkbox';
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
  completedToday?: number;
  totalHabits?: number;
  /** Best current streak across all habits (for greeting display) */
  currentStreak?: number;
}
