export interface DeleteUndoToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Name of the item being deleted */
  itemName: string;

  /** Duration before auto-dismiss in ms (default: 5000) */
  duration?: number;

  /** On dismiss callback (called when toast disappears) */
  onDismiss?: () => void;

  /** On undo callback (called when user taps undo) */
  onUndo?: () => void;

  /** On confirm callback (called when timer expires without undo) */
  onConfirm?: () => void;
}
