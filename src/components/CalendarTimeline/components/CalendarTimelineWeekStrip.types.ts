import type { CalendarTimelineProps } from '../CalendarTimeline.types';
import type { useCalendarTimelineSetup } from '../CalendarTimeline.derived';

export interface CalendarTimelineWeekStripProps {
  canNavigateForward: boolean;
  compact: boolean;
  completionByDay: CalendarTimelineProps['completionByDay'];
  completionIcon: CalendarTimelineProps['completionIcon'];
  currentStreak: CalendarTimelineProps['currentStreak'];
  dateSuffix: string;
  dates: CalendarTimelineProps['dates'];
  disableFutureDayPress: boolean;
  isDayPressEnabled: boolean;
  isViewingPast: boolean;
  monthName: string;
  onDayPress: CalendarTimelineProps['onDayPress'];
  onJumpToToday: CalendarTimelineProps['onJumpToToday'];
  onNextWeek?: () => void;
  onPreviousWeek?: () => void;
  reduceMotion: boolean;
  strengthPercent: number;
  tl: ReturnType<typeof useCalendarTimelineSetup>;
}
