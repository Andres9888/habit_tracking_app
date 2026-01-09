/**
 * AddFirstImageButton Component
 * Call-to-action button for adding the first vision board image
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ImagePlus } from 'lucide-react-native';

interface AddFirstImageButtonProps {
  onPress: () => void;
}

export function AddFirstImageButton({ onPress }: AddFirstImageButtonProps) {
  return (
    <View className='mt-4 items-center'>
      <Pressable
        accessibilityLabel='Add your first image'
        accessibilityRole='button'
        className='flex-row items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2'
        onPress={onPress}
      >
        <ImagePlus className='text-white' size={16} />
        <Text className='font-medium text-white'>Add Your First Image</Text>
      </Pressable>
    </View>
  );
}
