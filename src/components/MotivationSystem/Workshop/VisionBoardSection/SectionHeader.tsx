/**
 * SectionHeader Component
 * Header row for the Vision Board section with icon, title, and count
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { MAX_IMAGES, FREE_TIER_LIMIT } from './types';

interface SectionHeaderProps {
  hasImages: boolean;
  imageCount: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function SectionHeader({
  hasImages,
  imageCount,
  isPremium,
  onUpgrade,
}: SectionHeaderProps) {
  const isAtLimit = !isPremium && imageCount >= FREE_TIER_LIMIT;
  
  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>🖼️</Text>
        <Text className='text-xs font-semibold text-fuchsia-600'>
          Vision Board
        </Text>
        {!isPremium && (
          <Pressable
            onPress={isAtLimit ? onUpgrade : undefined}
            accessibilityRole={isAtLimit ? 'button' : 'text'}
            accessibilityLabel={
              isAtLimit
                ? `${imageCount} of ${FREE_TIER_LIMIT} free images used. Tap to upgrade.`
                : `${imageCount} of ${FREE_TIER_LIMIT} free images used`
            }
          >
            <View
              className={
                isAtLimit
                  ? 'rounded-full bg-fuchsia-500 px-1.5 py-0.5'
                  : 'rounded-full bg-fuchsia-100 px-1.5 py-0.5'
              }
            >
              <Text
                className={
                  isAtLimit
                    ? 'text-[9px] font-bold text-white'
                    : 'text-[9px] font-bold text-fuchsia-700'
                }
              >
                {imageCount}/{FREE_TIER_LIMIT} Free
              </Text>
            </View>
          </Pressable>
        )}
      </View>
      {hasImages && isPremium ? (
        <Text className='text-xs font-medium text-fuchsia-600'>
          {imageCount}/{MAX_IMAGES}
        </Text>
      ) : !hasImages ? (
        <View className='flex-row items-center gap-1'>
          <Plus className='text-fuchsia-600' size={12} />
          <Text className='text-xs font-medium text-fuchsia-600'>Add</Text>
        </View>
      ) : null}
    </View>
  );
}
