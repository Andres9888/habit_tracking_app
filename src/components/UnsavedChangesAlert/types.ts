export interface UnsavedChangesAlertProps {
  /** Whether the alert is visible */
  visible: boolean;
  /** Callback when user wants to discard changes */
  onDiscard: () => void;
  /** Callback when user wants to keep editing */
  onKeepEditing: () => void;
  /** Title for the alert (default: "Discard Changes?") */
  title?: string;
  /** Message describing what will be lost */
  message?: string;
  /** Label for discard button (default: "Discard") */
  discardButtonLabel?: string;
  /** Label for keep editing button (default: "Keep Editing") */
  keepEditingButtonLabel?: string;
  /** Optional preview of the content that will be lost */
  contentPreview?: string;
  /** Maximum length for content preview (default: 100) */
  previewMaxLength?: number;
  /** Accent color variant */
  variant?: 'rose' | 'amber';
}
