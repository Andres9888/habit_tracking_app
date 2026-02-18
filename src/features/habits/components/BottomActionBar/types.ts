export interface BottomActionBarProps {
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of habits */
  totalHabits: number;
  /** Whether to show the template notification badge */
  showTemplateBadge: boolean;
  /** Open the create-habit screen */
  onAddHabit: () => void;
  /** Open the settings modal */
  onOpenSettings: () => void;
  /** Open the templates browser */
  onOpenTemplates: () => void;
  /** Dismiss the template badge */
  onDismissTemplateBadge: () => void;
}
