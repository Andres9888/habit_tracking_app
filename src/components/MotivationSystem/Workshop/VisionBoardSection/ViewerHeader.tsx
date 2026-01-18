/**
 * ViewerHeader Component
 * Header bar for the image viewer modal with close, edit, and delete actions
 */

import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { X, Edit3, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ViewerHeaderProps {
  onClose: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function ViewerHeader({
  onClose,
  onToggleEdit,
  onDelete,
  isDeleting,
}: ViewerHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-14'>
      <Pressable
        accessibilityLabel='Close image viewer'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
      >
        <X className='text-white' size={20} />
      </Pressable>
      <View className='flex-row gap-2'>
        <Pressable
          accessibilityLabel='Edit caption'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleEdit();
          }}
        >
          <Edit3 className='text-white' size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel='Delete image'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
          disabled={isDeleting}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDelete();
          }}
        >
          {isDeleting ? (
            <ActivityIndicator color='#fff' size='small' />
          ) : (
            <Trash2 className='text-white' size={20} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
