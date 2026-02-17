/**
 * Progress Photos Types
 */

import type { Id } from '../../../convex/_generated/dataModel';

export interface ProgressPhoto {
  _id: Id<'progressPhotos'>;
  _creationTime: number;
  caption?: string;
  createdAt: number;
  habitId: Id<'habits'>;
  imageUrl?: string | null;
  storageId: Id<'_storage'>;
  updatedAt?: number;
  userId?: string;
}

export interface ProgressPhotosProps {
  habitId: Id<'habits'>;
  isPremium: boolean;
  onPremiumRequired: () => void;
}

export interface PhotoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onUpdateCaption: (caption?: string) => Promise<void>;
  photo: ProgressPhoto | null;
}

export interface PhotoTimelineProps {
  isPremium: boolean;
  onAddPhoto: () => void;
  onPhotoPress: (photo: ProgressPhoto) => void;
  photos: ProgressPhoto[];
}

export interface BeforeAfterComparisonProps {
  afterPhoto: ProgressPhoto;
  beforePhoto: ProgressPhoto;
  onClose: () => void;
}
