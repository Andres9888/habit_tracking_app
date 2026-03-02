/**
 * Types for VisionBoardPreview gesture handling
 */

import { springs } from '@/theme/animations';

export interface UseVisionBoardGesturesParams {
  reduceMotion: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  handleClose: () => void;
}

export const SPRING_CONFIG = springs.sheet;
