import type { ViewStyle } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';

export type DayShape = 'circle' | 'square';
export type CompletionIcon = 'chain' | 'checkbox';
export type HabitStatus = 'done' | 'missed' | 'planned';

export interface DayConnectorProps {
  accentColor: string;
  strengthPercent: number;
  style?: ViewStyle;
  visible: boolean;
}

export interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  completionIcon: CompletionIcon;
  completed: boolean;
  strengthPercent?: number;
  /** The date this slot currently shows. Drives a no-animation reset when the
   *  position-keyed slot is reused for a different date (week navigation). */
  dateString: string;
  disabled: boolean;
  isToday: boolean;
  missed?: boolean;
  onPress: () => void;
  shape: DayShape;
}

export interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled?: boolean;
  completionIcon?: CompletionIcon;
  strengthPercent?: number;
  habitId: Id<'habits'>;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference?: boolean;
  shape?: DayShape;
  showConnectors?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}
