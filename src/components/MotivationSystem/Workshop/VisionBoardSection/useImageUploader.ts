/**
 * useImageUploader Hook
 * Handles image picking and uploading for the Vision Board
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useImagePicker } from '../../../../hooks/useImagePicker';
import { useImageUpload } from '../../../../hooks/useImageUpload';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { MAX_IMAGES } from './types';

interface UseImageUploaderProps {
  isPremium: boolean;
  canAddMore: boolean;
  onAddImage: (storageId: Id<'_storage'>, caption?: string) => Promise<void>;
  onPremiumRequired: () => void;
}

export function useImageUploader({
  isPremium,
  canAddMore,
  onAddImage,
  onPremiumRequired,
}: UseImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const {
    pickFromCamera,
    pickFromLibrary,
    isLoading: isPickerLoading,
  } = useImagePicker();
  const { uploadImage, isUploading: isUploadInProgress } = useImageUpload();

  const isLoading = isPickerLoading || isUploadInProgress || isUploading;

  const handleAddImage = useCallback(
    async (source: 'camera' | 'library') => {
      if (!isPremium) {
        onPremiumRequired();
        return;
      }
      if (!canAddMore) {
        Alert.alert(
          'Vision Board Full',
          `You can add up to ${MAX_IMAGES} images to your Vision Board.`
        );
        return;
      }

      setIsUploading(true);
      try {
        const image =
          source === 'camera'
            ? await pickFromCamera({ aspect: [1, 1], quality: 0.8 })
            : await pickFromLibrary({ aspect: [1, 1], quality: 0.8 });

        if (!image) {
          setIsUploading(false);
          return;
        }

        const result = await uploadImage(image);
        if (!result) throw new Error('Failed to upload image');

        await onAddImage(result.storageId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        if (__DEV__) console.error('Failed to add image:', error);
        Alert.alert(
          'Upload Failed',
          'There was a problem adding your image. Please try again.'
        );
      } finally {
        setIsUploading(false);
      }
    },
    [
      isPremium,
      canAddMore,
      pickFromCamera,
      pickFromLibrary,
      uploadImage,
      onAddImage,
      onPremiumRequired,
    ]
  );

  return { handleAddImage, isLoading };
}
