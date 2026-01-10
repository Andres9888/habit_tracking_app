/**
 * LettersSectionHeader Component
 * Header row with icon, title, premium badge, and action indicator
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

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
  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>✉️</Text>
        <Text className='text-xs font-semibold text-violet-600'>
          Letters to Self
        </Text>
        {!isPremium && (
          <View className='rounded-full bg-amber-100 px-1.5 py-0.5'>
            <Text className='text-[9px] font-bold text-amber-700'>PRO</Text>
          </View>
        )}
      </View>
      {hasLetters && unreadCount > 0 ? (
        <View className='rounded-full bg-violet-500 px-2 py-0.5'>
          <Text className='text-[10px] font-semibold text-white'>
            {unreadCount} new
          </Text>
        </View>
      ) : hasLetters ? null : (
        <View className='flex-row items-center gap-1'>
          <Plus className='text-violet-600' size={12} />
          <Text className='text-xs font-medium text-violet-600'>Write</Text>
        </View>
      )}
    </View>
  );
}
