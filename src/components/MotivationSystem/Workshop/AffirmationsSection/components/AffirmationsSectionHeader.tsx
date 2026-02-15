/**
 * AffirmationsSectionHeader Component
 * Header row with icon, title, count badge, and add button
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Plus } from 'lucide-react-native';

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
  return (
    <View className='mb-1.5 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>💬</Text>
        <Text className='text-xs font-semibold text-amber-600'>
          Affirmations
        </Text>
        {!isPremium && (
          <View className='rounded-full bg-amber-100 px-1.5 py-0.5'>
            <Text className='text-[9px] font-bold text-amber-700'>
              {affirmationCount}/{FREE_TIER_MAX_AFFIRMATIONS}
            </Text>
          </View>
        )}
      </View>
      {!hasAffirmations && (
        <View className='flex-row items-center gap-1'>
          <Plus className='text-amber-600' size={12} />
          <Text className='text-xs font-medium text-amber-600'>Add</Text>
        </View>
      )}
    </View>
  );
}
