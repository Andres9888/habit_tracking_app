/**
 * VisionBoardSection Hooks - State management for the Vision Board feature
 */

import { useState, useCallback } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { MAX_IMAGES, type VisionBoardImage } from './types';
import { useImageUploader } from './useImageUploader';

interface UseVisionBoardStateProps {
  isPremium: boolean;
  imageCount: number;
  onAddImage: (storageId: Id<'_storage'>, caption?: string) => Promise<void>;
  onUpdateCaption: (imageId: string, caption?: string) => Promise<void>;
  onDeleteImage: (imageId: string) => Promise<void>;
  onPremiumRequired: () => void;
}

export function useVisionBoardState(props: UseVisionBoardStateProps) {
  const {
    isPremium,
    imageCount,
    onAddImage,
    onUpdateCaption,
    onDeleteImage,
    onPremiumRequired,
  } = props;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VisionBoardImage | null>(
    null
  );

  const hasImages = imageCount > 0;
  const canAddMore = imageCount < MAX_IMAGES;

  const { handleAddImage, isLoading } = useImageUploader({
    canAddMore,
    isPremium,
    onAddImage,
    onPremiumRequired,
  });

  const handleViewImage = useCallback((image: VisionBoardImage) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  }, []);

  const handleUpdateCaption = useCallback(
    async (caption?: string) => {
      if (!selectedImage) return;
      await onUpdateCaption(selectedImage.id, caption);
    },
    [selectedImage, onUpdateCaption]
  );

  const handleDeleteImage = useCallback(async () => {
    if (!selectedImage) return;
    await onDeleteImage(selectedImage.id);
  }, [selectedImage, onDeleteImage]);

  const handleSectionPress = useCallback(() => {
    if (!isPremium) onPremiumRequired();
  }, [isPremium, onPremiumRequired]);

  return {
    handleAddImage,
    handleCloseViewer,
    handleDeleteImage,
    handleSectionPress,
    handleUpdateCaption,
    handleViewImage,
    hasImages,
    isAddModalOpen,
    isLoading,
    isViewerOpen,
    selectedImage,
    setIsAddModalOpen,
  };
}
