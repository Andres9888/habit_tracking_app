/**
 * AddImageModal Component
 * 
 * Center overlay modal for selecting image source for Vision Board.
 * 
 * **Trigger:** "Add Image" button in Vision Board section
 * 
 * **Display:**
 * - Centered card overlay with backdrop
 * - Header with icon, title "Add to Vision Board", close button
 * - Two option buttons:
 *   - Take Photo (camera icon)
 *   - Choose from Library (image icon)
 * - Cancel button at bottom
 * 
 * **Actions:**
 * - Take Photo - Opens device camera, adds captured image
 * - Choose from Library - Opens photo picker, adds selected image
 * - Cancel/Close - Dismisses modal
 * 
 * **Modal Type:** React Native Modal (fade animation) with custom overlay
 * 
 * **Lifecycle:**
 * - Opens: visible=true from vision board
 * - Closes: onClose via any option selection, cancel, or backdrop tap
 * 
 * **Pattern:** Custom center overlay (not using shared Modal component)
 * Pressable backdrop with stopPropagation on content card
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Image as ImageIcon, ImagePlus, Camera, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ImageSourceOption } from './ImageSourceOption';

interface AddImageModalProps {
  visible: boolean;
  onClose: () => void;
  onPickFromCamera: () => void;
  onPickFromLibrary: () => void;
}

export function AddImageModal({
  visible,
  onClose,
  onPickFromCamera,
  onPickFromLibrary,
}: AddImageModalProps) {
  const { colors } = useThemeColors();

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 items-center justify-center bg-black/50'
        onPress={onClose}
      >
        <Pressable
          className='mx-6 w-full max-w-sm rounded-2xl p-6'
          style={{ backgroundColor: colors.surface }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100'>
                <ImagePlus className='text-fuchsia-600' size={20} />
              </View>
              <View>
                <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
                  Add to Vision Board
                </Text>
                <Text className='text-xs' style={{ color: colors.text.tertiary }}>
                  Choose how to add your image
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full'
              style={{ backgroundColor: colors.gray[200] }}
              onPress={onClose}
            >
              <X color={colors.text.secondary} size={20} />
            </Pressable>
          </View>

          <View className='gap-2'>
            <ImageSourceOption
              accessibilityLabel='Take a photo'
              description='Use your camera to capture an image'
              icon={Camera}
              title='Take Photo'
              onClose={onClose}
              onPress={onPickFromCamera}
            />
            <ImageSourceOption
              accessibilityLabel='Choose from library'
              description='Select an existing photo'
              icon={ImageIcon}
              title='Choose from Library'
              onClose={onClose}
              onPress={onPickFromLibrary}
            />
          </View>

          <Pressable
            accessibilityLabel='Cancel'
            accessibilityRole='button'
            className='mt-4 items-center py-2'
            onPress={onClose}
          >
            <Text className='font-medium' style={{ color: colors.text.tertiary }}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
