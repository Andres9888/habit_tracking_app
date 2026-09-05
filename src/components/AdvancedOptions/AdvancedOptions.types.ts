import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import type { ReminderRowProps } from './reminder/ReminderRow.types';

/** Rows of the "More to customize" panel — one may be open at a time. */
export type PanelRowKey = 'reminder' | 'why' | 'streak' | 'curve' | 'growth';

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
  /** Called after a row opens so the parent can scroll it into view. */
  onExpand?: () => void;
  /** Optional one-line motivation shown above Complete today on Detail. */
  why?: string;
  /** Presence of this handler is what enables the Your why row + chip. */
  onWhyChange?: (text: string) => void;
  /** The habit's chosen icon — stands in for the fourth growth stage. */
  habitIcon?: string | null;
  /** Presence of this bundle is what enables the Daily reminder row. */
  reminder?: ReminderRowProps;
}
