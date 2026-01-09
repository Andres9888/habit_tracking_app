/**
 * WriteLetterModal Types
 */

export interface WriteLetterModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    content: string,
    unlockDays: number,
    title?: string
  ) => Promise<void>;
  isSaving: boolean;
}

export type WriteLetterStep = 'write' | 'schedule';
