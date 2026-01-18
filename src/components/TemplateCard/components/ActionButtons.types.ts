/**
 * ActionButtons Types
 */

export interface ActionButtonsProps {
  checkmarkStyle: any;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  name: string;
  onImportPress: (e: any) => void;
  onPreview?: () => void;
  showPreviewCTA: boolean;
}
