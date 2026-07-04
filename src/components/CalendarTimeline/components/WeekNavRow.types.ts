export interface WeekNavRowProps {
  monthName: string;
  dateSuffix: string;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}
