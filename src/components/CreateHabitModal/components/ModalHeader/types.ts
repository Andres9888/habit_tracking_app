/**
 * ModalHeader types
 */

export interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  /** True while the save mutation is in flight (edit mode awaits the server) */
  isSaving?: boolean;
  onClose: () => void;
  onSave: () => void;
  /** Called when user taps Save with empty habit name */
  onValidationError?: () => void;
}
