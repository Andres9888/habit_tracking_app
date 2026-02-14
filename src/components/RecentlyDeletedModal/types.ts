import type { Id } from '../../../convex/_generated/dataModel';

export interface RecentlyDeletedModalProps {
  onClose: () => void;
  onBack: () => void;
}

export interface DeletedHabit {
  _id: Id<'habits'>;
  name: string;
  icon?: string;
  iconColor?: string;
  strength?: number;
  currentStreak?: number;
  totalCompletions?: number;
  deletedAt?: number;
  _creationTime: number;
}

export interface DeletedHabitCardProps {
  habit: DeletedHabit;
  index: number;
  daysRemaining: number;
  reducedMotion: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
  onDelete: (id: Id<'habits'>, name: string) => void;
}
