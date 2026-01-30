/**
 * Type definitions for AffirmationEditorModal
 */

import type { AffirmationType } from '../../AffirmationsSection.types';

export interface AffirmationEditorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string, type?: AffirmationType) => Promise<void>;
  initialText?: string;
  initialType?: AffirmationType;
  isEditing: boolean;
  isSaving: boolean;
  isPremium: boolean;
}
