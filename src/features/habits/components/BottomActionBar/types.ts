import type { SharedValue } from 'react-native-reanimated';
import type { CelebrationAnimStyles } from './useCelebrationAnimations';

export interface BottomActionBarProps {
  completedToday: number;
  totalHabits: number;
  reduceMotion: boolean;
  onAddHabit: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onLongPressSettings?: () => void;
}

export interface ProgressRingFABProps {
  completedToday: number;
  totalHabits: number;
  isAllDone: boolean;
  justCompleted: boolean;
  progress: SharedValue<number>;
  ringPulse: SharedValue<number>;
  celebrationAnim: CelebrationAnimStyles;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}
