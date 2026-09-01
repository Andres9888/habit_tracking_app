import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';

export interface AdvancedOptionsSectionProps {
  growthType?: GrowthType;
  /**
   * True on create flows: an untouched default curve follows the detected
   * habit-type suggestion. False on edit flows (and template previews with an
   * explicit template default): the incoming value is respected.
   */
  isNewHabit: boolean;
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onStreakGoalChange: (days: number) => void;
  /** Called after the section expands so the parent can scroll it into view. */
  onExpand?: () => void;
  /** Optional one-line motivation shown above Complete today on Detail. */
  why?: string;
  /** Presence of this handler is what enables the Your why row + chip. */
  onWhyChange?: (text: string) => void;
}
