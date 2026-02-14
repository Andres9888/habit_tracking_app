/**
 * useImageViewer Hook - State and handlers for the image viewer modal
 */

import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import type { VisionBoardImage } from './types';

interface UseImageViewerProps {
  image: VisionBoardImage | null;
  onUpdateCaption: (caption?: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export function useImageViewer({
  image,
  onUpdateCaption,
  onDelete,
  onClose,
}: UseImageViewerProps) {
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (image) {
      setCaptionText(image.caption || '');
      setIsEditingCaption(false);
    }
  }, [image?.id]);

  const handleSaveCaption = useCallback(async () => {
    setIsSaving(true);
    try {
      await onUpdateCaption(captionText.trim() || undefined);
      setIsEditingCaption(false);
    } catch (error) {
      if (__DEV__) console.error('Failed to save caption:', error);
    } finally {
      setIsSaving(false);
    }
  }, [captionText, onUpdateCaption]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to remove this image from your Vision Board?',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            setIsDeleting(true);
            try {
              await onDelete();
              onClose();
            } catch (error) {
              if (__DEV__) console.error('Failed to delete:', error);
              Alert.alert('Delete Failed', 'We couldn\u2019t remove the image. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [onDelete, onClose]);

  const handleCancel = useCallback(() => {
    setCaptionText(image?.caption || '');
    setIsEditingCaption(false);
  }, [image?.caption]);

  const toggleEdit = useCallback(() => setIsEditingCaption((v) => !v), []);

  return {
    captionText,
    handleCancel,
    handleDelete,
    handleSaveCaption,
    isDeleting,
    isEditingCaption,
    isSaving,
    setCaptionText,
    toggleEdit,
  };
}
