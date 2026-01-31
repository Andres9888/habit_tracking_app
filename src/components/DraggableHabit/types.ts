import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitCardEntranceVariant } from '../HabitCard/useHabitCardEntrance';

export type HabitStatus = 'done' | 'missed' | 'planned';

export interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  icon?: string;
  iconColor?: string;
  order?: number;
  preferredTime?: string;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
  strength?: number;
  strengthLevel?: string;
  strengthUpdatedAt?: number;
  bestStreak?: number;
}

export interface DraggableHabitProps {
  celebrationsEnabled: boolean;
  completionIcon?: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  entranceDelay?: number;
  entranceVariant?: HabitCardEntranceVariant;
  habit: Habit;
  highContrastMode?: boolean;
  isCompactMode?: boolean;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  isJustCreated?: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onEntranceComplete?: () => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onPress?: (habit: Habit) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  previousStreak?: number;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  triggerEntrance?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export interface CardColors {
  border: string;
  cardBackground: string;
  iconContainer: string | undefined;
  primaryText: string;
  streakText: string;
  strengthBackground: string;
}
