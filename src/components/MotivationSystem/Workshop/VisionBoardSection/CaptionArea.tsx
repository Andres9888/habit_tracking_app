/**
 * CaptionArea Component
 * Caption display and editing area for the image viewer
 */

import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_CAPTION_LENGTH, type VisionBoardImage } from './types';

interface CaptionAreaProps {
  isEditingCaption: boolean;
  captionText: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  image: VisionBoardImage;
}

export function CaptionArea({
  isEditingCaption,
  captionText,
  onChangeText,
  onSave,
  onCancel,
  isSaving,
  image,
}: CaptionAreaProps) {
  const insets = useSafeAreaInsets();
  if (isEditingCaption) {
    return (
      <View className='px-4 pt-4' style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
        <View className='gap-3'>
          <TextInput
            autoFocus
            multiline
            className='rounded-xl bg-white/10 px-4 py-3 text-base text-white'
            maxLength={MAX_CAPTION_LENGTH}
            value={captionText}
            {...buildTextInputHintProps('Add a caption...', '#a8a29e')}
            onChangeText={onChangeText}
          />
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-stone-400'>
              {captionText.length}/{MAX_CAPTION_LENGTH}
            </Text>
            <View className='flex-row gap-2'>
              <Pressable
                accessibilityLabel='Cancel editing'
                className='rounded-lg bg-stone-700 px-4 py-2'
                onPress={onCancel}
              >
                <Text className='font-medium text-white'>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityLabel='Save caption'
                className='rounded-lg bg-fuchsia-500 px-4 py-2'
                disabled={isSaving}
                onPress={onSave}
              >
                <Text className='font-medium text-white'>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className='px-4 pt-4' style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
      <View className='min-h-[48px] items-center justify-center'>
        {image.caption ? (
          <Text className='text-center text-base text-white'>
            {image.caption}
          </Text>
        ) : (
          <Text className='text-center text-base text-stone-500'>
            Tap the edit button to add a caption
          </Text>
        )}
      </View>
    </View>
  );
}
