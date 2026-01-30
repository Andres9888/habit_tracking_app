/**
 * WOOPSectionHeader - Header row for WOOPSection
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { HelpCircle, Plus, Pencil } from 'lucide-react-native';

interface WOOPSectionHeaderProps {
  hasWoop: boolean;
  onHelpPress: () => void;
}

export function WOOPSectionHeader({
  hasWoop,
  onHelpPress,
}: WOOPSectionHeaderProps) {
  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>🎯</Text>
        <Text className='text-xs font-semibold text-stone-800'>WOOP Plan</Text>
      </View>
      <View className='flex-row items-center gap-2'>
        <Pressable
          accessibilityLabel='Learn about WOOP'
          className='h-6 w-6 items-center justify-center rounded-full'
          hitSlop={8}
          onPress={onHelpPress}
        >
          <HelpCircle className='text-stone-400' size={16} />
        </Pressable>
        {hasWoop ? (
          <Pencil className='text-stone-400' size={14} />
        ) : (
          <View className='flex-row items-center gap-1'>
            <Plus className='text-stone-600' size={12} />
            <Text className='text-xs font-medium text-stone-600'>Set up</Text>
          </View>
        )}
      </View>
    </View>
  );
}
