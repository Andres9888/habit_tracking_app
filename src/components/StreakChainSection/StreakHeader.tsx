/**
 * StreakHeader Component
 * Header section showing flame icon and title
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Flame } from 'lucide-react-native';

interface StreakHeaderProps {
  currentIcon: string;
}

export function StreakHeader({ currentIcon }: StreakHeaderProps) {
  return (
    <View className='mb-4 flex-row items-center justify-center gap-2'>
      <View className='h-8 w-8 items-center justify-center rounded-lg bg-orange-100'>
        <Flame className='text-orange-500' size={16} />
      </View>
      <Text className='text-lg font-bold text-stone-800'>Streak</Text>
      {currentIcon ? <Text className='text-lg'>{currentIcon}</Text> : null}
    </View>
  );
}
