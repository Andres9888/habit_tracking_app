import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Info } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

interface SectionHeaderProps {
  title: string;
  onInfoPress?: () => void;
}

/**
 * Section header with title and info icon button
 */
export function SectionHeader({ title, onInfoPress }: SectionHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>{title}</Text>
      <Pressable
        accessible
        accessibilityLabel='Learn more about habit strength'
        accessibilityRole='button'
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        testID='strength-history-info-button'
        onPress={onInfoPress}
      >
        <Info color={themeColors.text.secondary} size={iconSizes.medium} />
      </Pressable>
    </View>
  );
}
