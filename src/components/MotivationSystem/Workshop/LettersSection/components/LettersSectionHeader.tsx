/**
 * LettersSectionHeader Component
 * Header row with icon, title, premium badge, and action indicator
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface LettersSectionHeaderProps {
  isPremium: boolean;
  hasLetters: boolean;
  unreadCount: number;
}

export function LettersSectionHeader({
  isPremium,
  hasLetters,
  unreadCount,
}: LettersSectionHeaderProps) {
  const { colors, isDark } = useThemeColors();
  
  // Theme-aware colors for violet accent
  const violetText = isDark ? '#c4b5fd' : '#7c3aed';
  const violetBg = isDark ? '#5b21b6' : '#8b5cf6';
  const premiumBadgeBg = isDark ? '#78350f' : '#fef3c7';
  const premiumBadgeText = isDark ? '#fcd34d' : '#92400e';

  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>✉️</Text>
        <Text className='text-xs font-semibold' style={{ color: violetText }}>
          Letters to Self
        </Text>
        {!isPremium && (
          <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: premiumBadgeBg }}>
            <Text className='text-[9px] font-bold' style={{ color: premiumBadgeText }}>PRO</Text>
          </View>
        )}
      </View>
      {hasLetters && unreadCount > 0 ? (
        <View className='rounded-full px-2 py-0.5' style={{ backgroundColor: violetBg }}>
          <Text className='text-[10px] font-semibold text-white'>
            {unreadCount} new
          </Text>
        </View>
      ) : hasLetters ? null : (
        <View className='flex-row items-center gap-1'>
          <Plus color={violetText} size={12} />
          <Text className='text-xs font-medium' style={{ color: violetText }}>Write</Text>
        </View>
      )}
    </View>
  );
}
