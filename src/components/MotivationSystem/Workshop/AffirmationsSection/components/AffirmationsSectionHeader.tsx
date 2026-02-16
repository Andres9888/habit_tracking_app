/**
 * AffirmationsSectionHeader Component
 * Header row with icon, title, count badge, and add button
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { FREE_TIER_MAX_AFFIRMATIONS } from '../AffirmationsSection.constants';

interface AffirmationsSectionHeaderProps {
  isPremium: boolean;
  affirmationCount: number;
  hasAffirmations: boolean;
}

export function AffirmationsSectionHeader({
  isPremium,
  affirmationCount,
  hasAffirmations,
}: AffirmationsSectionHeaderProps) {
  const { isDark } = useThemeColors();
  
  // Theme-aware colors for amber accent
  const amberText = isDark ? '#fbbf24' : '#d97706';
  const countBadgeBg = isDark ? '#78350f' : '#fef3c7';
  const countBadgeText = isDark ? '#fcd34d' : '#92400e';

  return (
    <View className='mb-1.5 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>💬</Text>
        <Text className='text-xs font-semibold' style={{ color: amberText }}>
          Affirmations
        </Text>
        {!isPremium && (
          <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: countBadgeBg }}>
            <Text className='text-[9px] font-bold' style={{ color: countBadgeText }}>
              {affirmationCount}/{FREE_TIER_MAX_AFFIRMATIONS}
            </Text>
          </View>
        )}
      </View>
      {!hasAffirmations && (
        <View className='flex-row items-center gap-1'>
          <Plus color={amberText} size={12} />
          <Text className='text-xs font-medium' style={{ color: amberText }}>Add</Text>
        </View>
      )}
    </View>
  );
}
