import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';

export interface DayCellContentProps {
  weekday: string;
  capacityMinutes?: number;
  dayNumber: string;
  index: number;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionStatus: CompletionStatus;
  completed: number;
  total: number;
  hasCompletionData: boolean;
  colors: CalendarColors;
  completionIcon?: 'chain' | 'checkbox';
  monthPrefix?: string;
  reduceMotion: boolean;
  pressed?: boolean;
  strengthPercent?: number;
  plannedMinutes?: number;
  remainingMinutes?: number;
}
