/**
 * Type definitions for CelebrationOverlay
 */

import type { TemplateToastData } from './types';

export interface CelebrationOverlayProps {
  visible: boolean;
  templateData: TemplateToastData | null;
  onGoToHabits: () => void;
  onAddAnother: () => void;
}
