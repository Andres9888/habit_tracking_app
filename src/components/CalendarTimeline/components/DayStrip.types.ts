import type {
  CalendarColors,
  CompletionStatus,
  DayCompletionStatus,
} from '../CalendarTimeline.types';

export interface DayStripProps {
  dates: Date[];
  completionCounts: DayCompletionStatus[];
  completionStatuses: CompletionStatus[];
  augmentedColors: CalendarColors;
  hasCompletionData: boolean;
  connectorColor: string;
  reduceMotion: boolean;
  completionIcon?: 'chain' | 'checkbox';
  ghostConnectorColor: string;
  currentStreak?: number;
  strengthPercent?: number;
  disableFutureDayPress: boolean;
  isDayPressEnabled: boolean;
  isToday: (d: Date) => boolean;
  isFuture: (d: Date) => boolean;
  onDayPress?: (date: Date) => void;
  panGesture: ReturnType<
    typeof import('react-native-gesture-handler').Gesture.Pan
  >;
  weekTransitionStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
}
