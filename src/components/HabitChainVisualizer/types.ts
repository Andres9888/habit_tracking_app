import type { ViewStyle } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';

export type DayShape = 'circle' | 'square';
export type CompletionIcon = 'chain' | 'checkbox';
export type HabitStatus = 'done' | 'missed' | 'planned';

export interface StrengthConfig {
  height: number;
  maxOpacity: number;
  shimmerSpeed: number;
  useAccent: boolean;
}

export interface DayConnectorProps {
  accentColor: string;
  baseColor: string;
  currentStreak: number;
  style?: ViewStyle;
  visible: boolean;
}

export interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  completionIcon: CompletionIcon;
  completed: boolean;
  currentStreak?: number;
  disabled: boolean;
  highContrastMode: boolean;
  isToday: boolean;
  onPress: () => void;
  shape: DayShape;
}

export interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled?: boolean;
  completionIcon?: CompletionIcon;
  currentStreak?: number;
  habitId: Id<'habits'>;
  highContrastMode?: boolean;
  isConnectedToPreviousWeek?: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference?: boolean;
  shape?: DayShape;
  showConnectors?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}
