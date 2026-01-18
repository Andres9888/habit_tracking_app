/**
 * ModalHeader types
 */

export interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  onClose: () => void;
  onSave: () => void;
  isKeyboardVisible?: boolean;
  onDismissKeyboard?: () => void;
  /** Called when user taps Save with empty habit name */
  onValidationError?: () => void;
}
