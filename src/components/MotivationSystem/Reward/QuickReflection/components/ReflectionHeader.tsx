
import React from 'react';
import { View, Text } from 'react-native';

import { Plus } from 'lucide-react-native';

interface ReflectionHeaderProps {
  hasSelection: boolean;
}

export function ReflectionHeader({ hasSelection }: ReflectionHeaderProps) {
  return (
    <View className='mb-3 flex-row items-center justify-between'>
      <Text className='font-semibold text-stone-800'>Quick Reflection</Text>
      {!hasSelection && (
        <View className='flex-row items-center gap-1'>
          <Plus className='text-emerald-600' size={12} />
          <Text className='text-xs font-medium text-emerald-600'>Rate it</Text>
        </View>
      )}
    </View>
  );
}
