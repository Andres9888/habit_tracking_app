/**
 * VisionBoardPreview Type Definitions
 */

import type { Doc } from '../../../convex/_generated/dataModel';

export type VisionBoardItem = Doc<'visionBoardItems'>;

export interface VisionBoardPreviewProps {
  items: VisionBoardItem[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (item: VisionBoardItem) => void;
}

export interface PreviewHeaderProps {
  currentIndex: number;
  itemCount: number;
  onClose: () => void;
  onEdit: () => void;
  topPadding: number;
}

export interface PreviewContentProps {
  item: VisionBoardItem;
}

export interface NavigationControlsProps {
  currentIndex: number;
  itemCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  bottomPadding: number;
}
