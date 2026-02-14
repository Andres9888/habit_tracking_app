/**
 * ImageViewerModal Component - Full-size image viewer with caption editing and delete
 */

import React from 'react';
import {
  View,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
              accessibilityIgnoresInvertColors
              accessibilityLabel={image.caption || 'Vision board image preview'}
              accessibilityRole='image'
              resizeMode='contain'
              source={{ uri: image.imageUrl }}
              style={{ height: SCREEN_WIDTH, width: SCREEN_WIDTH }}
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
