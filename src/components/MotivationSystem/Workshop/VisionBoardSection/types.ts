/**
 * VisionBoardSection Types
 * Type definitions and constants for the Vision Board feature
 */

import { Dimensions } from 'react-native';

import type { Id } from '../../../../../convex/_generated/dataModel';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface VisionBoardImage {
  id: string;
  storageId: Id<'_storage'>;
  imageUrl: string | null;
  caption?: string;
  order: number;
  createdAt: number;
}

export interface VisionBoardSectionProps {
  /** List of existing images */
  images: VisionBoardImage[];
  /** Number of images (for analytics) */
  imageCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new image is added */
  onAddImage: (storageId: Id<'_storage'>, caption?: string) => Promise<void>;
  /** Callback when an image caption is updated */
  onUpdateCaption: (imageId: string, caption?: string) => Promise<void>;
  /** Callback when an image is deleted */
  onDeleteImage: (imageId: string) => Promise<void>;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Maximum images per habit (4-image grid as per spec) */
export const MAX_IMAGES = 4;

/** Maximum caption length (matching Convex validation) */
export const MAX_CAPTION_LENGTH = 200;

/** Get screen width for image sizing */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Size for each image in the grid (2 columns with padding) */
export const IMAGE_SIZE = (SCREEN_WIDTH - 64) / 2;

/** Screen width export for modals */
export { SCREEN_WIDTH };
