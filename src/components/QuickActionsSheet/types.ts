import type { Id } from '../../../convex/_generated/dataModel';

export interface QuickActionsSheetProps {
  /** Habit data */
  habit: {
    _id: Id<'habits'>;
    name: string;
    icon?: string;
    completed?: boolean;
  } | null;

  /** Is the sheet visible */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Complete/uncomplete habit */
  onComplete?: () => void;

  /** Open Mental Boost (Visualization Exercise) */
  onMentalBoost?: () => void;

  /** View habit calendar */
  onViewCalendar?: () => void;

  /** View habit detail page */
  onViewDetails?: () => void;

  /** Edit habit */
  onEdit?: () => void;

  /** Pause habit */
  onPause?: () => void;

  /** Delete habit */
  onDelete?: () => void;
}

export interface ActionItemProps {
  destructive?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  subtitle?: string;
  badge?: string;
}

export interface ActionsListProps {
  completed: boolean;
  onComplete: () => void;
  onMentalBoost: () => void;
  onViewCalendar: () => void;
  onViewDetails?: () => void;
  onEdit: () => void;
  onPause: () => void;
  onDelete: () => void;
}
