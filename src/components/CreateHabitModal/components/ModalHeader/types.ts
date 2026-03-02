/**
 * ModalHeader types
 */

export interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  onClose: () => void;
  onSave: () => void;
  /** Called when user taps Save with empty habit name */
  onValidationError?: () => void;
}
