/**
 * Types for useUnsavedChangesGuard hook
 */

/**
 * Configuration options for the hook
 */
export interface UseUnsavedChangesGuardOptions {
  /** Current value of the form field */
  currentValue: string;
  /** Original value (from database/props) */
  originalValue: string;
  /** Title for the confirmation dialog */
  alertTitle?: string;
  /** Message for the confirmation dialog */
  alertMessage?: string;
  /** Label for the discard button */
  discardButtonLabel?: string;
  /** Label for the keep editing button */
  keepEditingButtonLabel?: string;
  /** Whether to show the guard (can disable for save-in-progress) */
  enabled?: boolean;
  /** Callback when user confirms discard */
  onDiscard?: () => void;
  /** Whether to intercept Native Handset back button (default: false) */
  interceptBackButton?: boolean;
}

/**
 * Return value from the hook
 */
export interface UseUnsavedChangesGuardReturn {
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Show confirmation dialog and execute callback if user confirms discard */
  confirmDiscard: (onConfirm: () => void) => void;
  /** Show confirmation dialog and return Promise<boolean> */
  confirmDiscardAsync: () => Promise<boolean>;
  /** Update the original value (e.g., after successful save) */
  setOriginalValue: (value: string) => void;
  /** Whether the confirmation dialog is currently showing */
  isConfirmationVisible: boolean;
  /** Directly perform discard action (bypasses confirmation) */
  forceDiscard: () => void;
}
