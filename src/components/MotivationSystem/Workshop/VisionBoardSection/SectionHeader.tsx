/**
 * SectionHeader Component
 * Header row for the Vision Board section with icon, title, and count
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { MAX_IMAGES } from './types';

interface SectionHeaderProps {
  hasImages: boolean;
  imageCount: number;
  isPremium: boolean;
}

export function SectionHeader({
  hasImages,
  imageCount,
  isPremium,
}: SectionHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>🖼️</Text>
        <Text className='text-xs font-semibold text-fuchsia-600'>
          Vision Board
        </Text>
        {isPremium ? null : <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.status.warningLight }}>
            <Text className='text-[9px] font-bold' style={{ color: colors.status.warningText }}>PRO</Text>
          </View>}
      </View>
      {hasImages ? (
        <Text className='text-xs font-medium text-fuchsia-600'>
          {imageCount}/{MAX_IMAGES}
        </Text>
      ) : (
        <View className='flex-row items-center gap-1'>
          <Plus className='text-fuchsia-600' size={iconSizes.small} />
          <Text className='text-xs font-medium text-fuchsia-600'>Add</Text>
        </View>
      )}
    </View>
  );
}
