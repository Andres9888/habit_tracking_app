/**
 * ModalHeader - Header section with title and close button
 * Uses theme-aware colors for dark mode support.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PartyPopper, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <PartyPopper color={colors.primary[500]} size={20} />
        <Text
          className='text-lg font-bold'
          style={{ color: colors.primary[700] }}
        >
          Celebration
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Close celebration'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.gray[200] + '80' }}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={24} />
      </Pressable>
    </View>
  );
}
