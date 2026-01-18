/**
 * Types for VisionBoardPreview gesture handling
 */

export interface UseVisionBoardGesturesParams {
  reduceMotion: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  handleClose: () => void;
}

export const SPRING_CONFIG = { damping: 20, stiffness: 200 };
