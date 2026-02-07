/**
 * PreviewHeader Component
 * Header with close, counter, and edit buttons
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { X, Edit3, Eye } from 'lucide-react-native';
import type { PreviewHeaderProps } from '../VisionBoardPreview.types';

export function PreviewHeader({
  currentIndex,
  itemCount,
  onClose,
  onEdit,
  topPadding,
}: PreviewHeaderProps) {
  return (
    <View
      className='flex-row items-center justify-between px-5'
      style={{ paddingTop: topPadding }}
    >
      {/* Close button */}
      <Pressable
        accessibilityLabel='Close preview'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20'
        onPress={onClose}
      >
        <X className='text-white' size={24} />
      </Pressable>

      {/* Counter */}
      <View className='flex-row items-center gap-2'>
        <Eye className='text-white/60' size={16} />
        <Text className='text-sm font-medium text-white/80'>
          {currentIndex + 1} of {itemCount}
        </Text>
      </View>

      {/* Edit button */}
      <Pressable
        accessibilityLabel='Edit this card'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20'
        onPress={onEdit}
      >
        <Edit3 className='text-white' size={20} />
      </Pressable>
    </View>
  );
}
