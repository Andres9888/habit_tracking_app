import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';

export interface AdvancedOptionsSectionProps {
  growthType?: GrowthType;
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onStreakGoalChange: (days: number) => void;
  /** Entrance animation base delay; defaults sensible for HabitEditScreen. */
  baseDelay?: number;
  /** Called after the section expands so the parent can scroll it into view. */
  onExpand?: () => void;
}
