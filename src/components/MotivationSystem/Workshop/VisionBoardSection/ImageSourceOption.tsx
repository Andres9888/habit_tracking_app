/**
 * ImageSourceOption Component
 * Reusable option button for camera or library selection
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';

interface ImageSourceOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accessibilityLabel: string;
  onPress: () => void;
  onClose: () => void;
}

export function ImageSourceOption({
  icon: Icon,
  title,
  description,
  accessibilityLabel,
  onPress,
  onClose,
}: ImageSourceOptionProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-xl border border-stone-200 p-4'
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
        onClose();
      }}
    >
      <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
        <Icon className='text-fuchsia-500' size={20} />
      </View>
      <View className='flex-1'>
        <Text className='font-medium text-stone-800'>{title}</Text>
        <Text className='text-xs text-stone-500'>{description}</Text>
      </View>
    </Pressable>
  );
}
