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
  disabled: boolean;
  enableTodayPulse?: boolean;
  highContrastMode: boolean;
  isToday: boolean;
  missed?: boolean;
  onPress: () => void;
  shape: DayShape;
  strengthPercent?: number;
}

export interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled?: boolean;
  completionIcon?: CompletionIcon;
  enableTodayPulse?: boolean;
  habitId: Id<'habits'>;
  highContrastMode?: boolean;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference?: boolean;
  shape?: DayShape;
  showConnectors?: boolean;
  strengthPercent?: number;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}
