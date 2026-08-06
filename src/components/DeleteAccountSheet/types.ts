/** DeleteAccountSheet — prop contract */
export interface DeleteAccountSheetProps {
  visible: boolean;
  isDeleting: boolean;
  acknowledged: boolean;
  onToggleAcknowledged: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional export handler for the "Export a copy first" safe exit. */
  onExportHabitsData?: () => void | Promise<void>;
}
