import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface RescueModeHeaderProps {
  onClose: () => void;
}

/**
 * RescueModeHeader - Top header bar with emergency styling
 */
export function RescueModeHeader({ onClose }: RescueModeHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <AlertTriangle color={colors.status.error} size={20} />
        <Text className='text-lg font-bold' style={{ color: colors.status.errorText }}>🆘 Rescue Mode</Text>
      </View>
      <Pressable
        accessibilityLabel='Close rescue mode'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: `${colors.border}80` }}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={24} />
      </Pressable>
    </View>
  );
}
