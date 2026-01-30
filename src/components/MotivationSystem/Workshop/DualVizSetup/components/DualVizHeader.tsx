/**
 * DualVizHeader Component
 * Header section for DualVizSetup with title and action button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { HelpCircle, Plus, Pencil } from 'lucide-react-native';

interface DualVizHeaderProps {
  hasViz: boolean;
  onHelpPress: () => void;
}

export function DualVizHeader({ hasViz, onHelpPress }: DualVizHeaderProps) {
  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>👁️</Text>
        <View>
          <Text className='text-xs font-semibold text-violet-600'>
            Visualization Setup
          </Text>
          <Text className='text-[10px] text-stone-400'>Huberman Protocol</Text>
        </View>
      </View>
      <View className='flex-row items-center gap-2'>
        <Pressable
          accessibilityLabel='Learn about dual visualization'
          className='h-6 w-6 items-center justify-center rounded-full'
          hitSlop={8}
          onPress={onHelpPress}
        >
          <HelpCircle className='text-stone-400' size={16} />
        </Pressable>
        {hasViz ? (
          <Pencil className='text-stone-400' size={14} />
        ) : (
          <View className='flex-row items-center gap-1'>
            <Plus className='text-violet-600' size={12} />
            <Text className='text-xs font-medium text-violet-600'>Set up</Text>
          </View>
        )}
      </View>
    </View>
  );
}
