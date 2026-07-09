export interface WeekNavRowProps {
  monthName: string;
  dateSuffix: string;
  isCalendarOpen?: boolean;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}
