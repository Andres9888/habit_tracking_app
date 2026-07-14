/**
 * CompleteUndoToast Types
 * Toast offering Undo after the one-way "Mark as done" CTA
 */

export interface CompleteUndoToastProps {
  /** Toast visibility */
  visible: boolean;
  /** Message to display, e.g. "Habit done!" or "Already done today" */
  message: string;
  /** Auto-dismiss duration in ms (default: 3200 — longer than a plain toast
   * since this is the only path back once the CTA becomes one-way) */
  duration?: number;
  /** Reverses the completion — routes through the same toggle mutation as
   * every other surface */
  onUndo: () => void;
  /** Called when the toast auto-dismisses or is swiped away */
  onDismiss?: () => void;
}
