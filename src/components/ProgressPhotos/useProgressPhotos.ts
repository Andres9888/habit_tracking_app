/**
 * useProgressPhotos Hook
 * Manages state and actions for progress photos
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import * as Haptics from 'expo-haptics';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useImageUpload } from '../../hooks/useImageUpload';
import { FREE_TIER_PHOTO_LIMIT } from './ProgressPhotos.constants';
import type { ProgressPhoto } from './ProgressPhotos.types';

interface UseProgressPhotosProps {
  habitId: Id<'habits'>;
  isPremium: boolean;
  onPremiumRequired: () => void;
}

export function useProgressPhotos({
  habitId,
  isPremium,
  onPremiumRequired,
}: UseProgressPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Queries
  const photos = useQuery(api.progressPhotosQueries.getByHabit, { habitId }) ?? [];
  const photoCount = photos.length;

  // Mutations
  const createPhoto = useMutation(api.progressPhotosCreate.create);
  const deletePhoto = useMutation(api.progressPhotosDelete.deletePhoto);
  const updateCaption = useMutation(api.progressPhotosUpdate.updateCaption);

  // Image picker and upload
  const { pickFromCamera, pickFromLibrary } = useImagePicker();
  const { uploadImage } = useImageUpload();

  const canAddMore = isPremium || photoCount < FREE_TIER_PHOTO_LIMIT;

  const handleAddPhoto = useCallback(
    async (source: 'camera' | 'library') => {
      if (!isPremium && photoCount >= FREE_TIER_PHOTO_LIMIT) {
        onPremiumRequired();
        return;
      }

      if (!canAddMore) {
        Alert.alert(
          'Photo Limit Reached',
          `You've reached the maximum number of photos. ${
            isPremium
              ? 'Please delete a photo to add a new one.'
              : 'Upgrade to Premium for unlimited photos.'
          }`
        );
        return;
      }

      setIsUploading(true);
      try {
        const image =
          source === 'camera'
            ? await pickFromCamera({ aspect: [3, 4], quality: 0.8 })
            : await pickFromLibrary({ aspect: [3, 4], quality: 0.8 });

        if (!image) {
          setIsUploading(false);
          return;
        }

        const result = await uploadImage(image);
        if (!result) throw new Error('Failed to upload image');

        await createPhoto({
          habitId,
          storageId: result.storageId,
        });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to add photo:', error);
        Alert.alert('Upload Failed', 'Failed to upload photo. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [
      habitId,
      isPremium,
      photoCount,
      canAddMore,
      pickFromCamera,
      pickFromLibrary,
      uploadImage,
      createPhoto,
      onPremiumRequired,
    ]
  );

  const handleViewPhoto = useCallback((photo: ProgressPhoto) => {
    setSelectedPhoto(photo);
    setIsViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  }, []);

  const handleDeletePhoto = useCallback(async () => {
    if (!selectedPhoto) return;

    try {
      await deletePhoto({ photoId: selectedPhoto._id });
      handleCloseViewer();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete photo:', error);
      Alert.alert('Delete Failed', 'Failed to delete photo. Please try again.');
    }
  }, [selectedPhoto, deletePhoto, handleCloseViewer]);

  const handleUpdateCaption = useCallback(
    async (caption?: string) => {
      if (!selectedPhoto) return;

      try {
        await updateCaption({
          caption,
          photoId: selectedPhoto._id,
        });
        // Update local state
        setSelectedPhoto((prev) => (prev ? { ...prev, caption } : null));
      } catch (error) {
        console.error('Failed to update caption:', error);
        Alert.alert('Update Failed', 'Failed to update caption. Please try again.');
      }
    },
    [selectedPhoto, updateCaption]
  );

  return {
    canAddMore,
    handleAddPhoto,
    handleCloseViewer,
    handleDeletePhoto,
    handleUpdateCaption,
    handleViewPhoto,
    isUploading,
    isViewerOpen,
    photoCount,
    photos,
    selectedPhoto,
  };
}
