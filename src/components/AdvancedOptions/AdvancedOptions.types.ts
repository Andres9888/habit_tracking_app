import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';

export interface AdvancedOptionsSectionProps {
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onStreakGoalChange: (days: number) => void;
  /** Entrance animation base delay; defaults sensible for HabitEditScreen. */
  baseDelay?: number;
}
