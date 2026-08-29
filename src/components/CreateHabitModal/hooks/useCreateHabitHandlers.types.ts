import type { Id } from '../../../../convex/_generated/dataModel';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

export interface HabitData {
  dayPhase: string | null;
  frequency: string;
  fullHabitName: string;
  hasReminders: boolean;
  reminderSound?: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedDays: number[];
  selectedEmoji: string | null;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
}

export interface CreateHabitData extends HabitData {
  clientRequestId: string;
}

export interface EditHabitData extends HabitData {
  habitToEdit: {
    _id: Id<'habits'>;
    notes?: string;
  };
}
