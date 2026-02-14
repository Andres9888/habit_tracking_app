export interface QuickAddHabitSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** Callback to close the sheet */
  onClose: () => void;
  /** Optional callback fired after a habit is successfully created */
  onHabitCreated?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}
