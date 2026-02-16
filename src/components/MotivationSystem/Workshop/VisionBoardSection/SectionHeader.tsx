/**
 * SectionHeader Component
 * Header row for the Vision Board section with icon, title, and count
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
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
  const { isDark } = useThemeColors();
  
  // Theme-aware colors for fuchsia accent
  const fuchsiaText = isDark ? '#f0abfc' : '#c026d3';
  const premiumBadgeBg = isDark ? '#78350f' : '#fef3c7';
  const premiumBadgeText = isDark ? '#fcd34d' : '#92400e';

  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>🖼️</Text>
        <Text className='text-xs font-semibold' style={{ color: fuchsiaText }}>
          Vision Board
        </Text>
        {!isPremium && (
          <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: premiumBadgeBg }}>
            <Text className='text-[9px] font-bold' style={{ color: premiumBadgeText }}>PRO</Text>
          </View>
        )}
      </View>
      {hasImages ? (
        <Text className='text-xs font-medium' style={{ color: fuchsiaText }}>
          {imageCount}/{MAX_IMAGES}
        </Text>
      ) : (
        <View className='flex-row items-center gap-1'>
          <Plus color={fuchsiaText} size={12} />
          <Text className='text-xs font-medium' style={{ color: fuchsiaText }}>Add</Text>
        </View>
      )}
    </View>
  );
}
