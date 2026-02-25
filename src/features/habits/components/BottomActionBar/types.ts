export interface BottomActionBarProps {
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of active habits */
  totalHabits: number;
  /** Whether the user prefers reduced motion */
  reduceMotion: boolean;
  /** Open the create-habit screen */
  onAddHabit: () => void;
  /** Open the settings modal */
  onOpenSettings: () => void;
  /** Open the templates browser */
  onOpenTemplates: () => void;
}
