import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit } from '../../features/habits/types';

export interface HabitEditScreenProps {
  visible: boolean;
  habitId: Id<'habits'> | null;
  initialHabit?: Habit | null;
  onClose: () => void;
  onHabitRemoved?: () => void;
  onOpenCueEditor?: () => void;
  onOpenVisionBoard?: () => void;
}

export interface HabitEditState {
  habitName: string;
  setHabitName: (name: string) => void;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  handleEmojiSelect: (emoji: string | null) => void;
  handleColorSelect: (color: string) => void;
  handleReminderToggle: (enabled: boolean) => void;
  handleReminderTimeChange: (time: Date) => void;
  handleSave: () => Promise<void>;
  handleDelete: () => void;
  handleArchive: () => void;
}
