/**
 * ImageViewerModal Component - Full-size image viewer with caption editing and delete
 * Uses expo-image for optimized memory management (App Store compliance)
 */

import React from 'react';
import {
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { ViewerHeader } from './ViewerHeader';
import { CaptionArea } from './CaptionArea';
import { useImageViewer } from './useImageViewer';
import { SCREEN_WIDTH, type VisionBoardImage } from './types';

interface ImageViewerModalProps {
  visible: boolean;
  image: VisionBoardImage | null;
  onClose: () => void;
  onUpdateCaption: (caption?: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ImageViewerModal({
  visible,
  image,
  onClose,
  onUpdateCaption,
  onDelete,
}: ImageViewerModalProps) {
  const viewer = useImageViewer({ image, onClose, onDelete, onUpdateCaption });

  if (!image) return null;

  return (
    <Modal
      animationType='fade'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-black'
      >
        <ViewerHeader
          isDeleting={viewer.isDeleting}
          onClose={onClose}
          onDelete={viewer.handleDelete}
          onToggleEdit={viewer.toggleEdit}
        />
        <View className='flex-1 items-center justify-center'>
          {image.imageUrl && (
            <Image
              accessibilityLabel='Full size vision board image'
              contentFit="contain"
              source={{ uri: image.imageUrl }}
              style={{ height: SCREEN_WIDTH, width: SCREEN_WIDTH }}
              cachePolicy="memory-disk"
              transition={200}
            />
          )}
        </View>
        <CaptionArea
          captionText={viewer.captionText}
          image={image}
          isEditingCaption={viewer.isEditingCaption}
          isSaving={viewer.isSaving}
          onCancel={viewer.handleCancel}
          onChangeText={viewer.setCaptionText}
          onSave={viewer.handleSaveCaption}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
