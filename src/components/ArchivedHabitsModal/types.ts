import type { Id } from '../../../convex/_generated/dataModel';

export interface ArchivedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

export interface ArchivedHabit {
  _id: Id<'habits'>;
  name: string;
  icon?: string;
  iconColor?: string;
  strength?: number;
  currentStreak?: number;
  totalCompletions?: number;
  archivedAt?: number;
  _creationTime: number;
}

export interface AnimatedHabitCardProps {
  habit: ArchivedHabit;
  index: number;
  reducedMotion: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
  onDelete: (id: Id<'habits'>, name: string) => void;
}

export interface StrengthInfo {
  emoji: string;
  label: string;
  bgColor: string;
  textColor: string;
  bgStyle?: string;
  textStyle?: string;
}
