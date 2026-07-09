export interface WeekNavRowProps {
  monthName: string;
  dateSuffix: string;
  isCalendarOpen?: boolean;
  isViewingPast: boolean;
  todayDayNumber?: string;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}
