/**
 * ArchiveUndoToast Types
 */

export interface ArchiveUndoToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Name of the archived habit */
  habitName: string;

  /** Duration before auto-dismiss in ms (default: 5000) */
  duration?: number;

  /** On dismiss callback (called when toast disappears) */
  onDismiss?: () => void;

  /** On undo callback (called when user taps undo) */
  onUndo?: () => void;
}

export const DISMISS_THRESHOLD = 50;
export const DEFAULT_DURATION = 5000;
