import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ActivationModalHeaderProps {
  onClose: () => void;
}

/**
 * ActivationModalHeader - Header with title and close button
 */
export function ActivationModalHeader({ onClose }: ActivationModalHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <Zap color={themeColors.status.warning} size={20} />
        <Text className='text-lg font-bold' style={{ color: themeColors.text.primary }}>Time to Build</Text>
      </View>
      <Pressable
        accessibilityLabel='Close activation modal'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: themeColors.border }}
        onPress={onClose}
      >
        <X color={themeColors.text.primary} size={24} />
      </Pressable>
    </View>
  );
}
