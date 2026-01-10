/**
 * ReadLetterModal Types
 */

import type { LetterData } from '../../LettersSection.types';

export interface ReadLetterModalProps {
  visible: boolean;
  letter: LetterData | null;
  onClose: () => void;
  onMarkAsRead: (letterId: string) => void;
  reduceMotion?: boolean;
}
