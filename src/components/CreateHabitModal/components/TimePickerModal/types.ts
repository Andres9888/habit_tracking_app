/**
 * Type definitions for TimePickerModal component
 */

export interface TimePickerModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Initial time to display when the modal opens */
  initialTime: Date;
  /** Called when user confirms their selection */
  onConfirm: (time: Date) => void;
  /** Called when user cancels/dismisses the modal */
  onCancel: () => void;
  /** Optional title for the modal header (iOS only) */
  title?: string;
}
