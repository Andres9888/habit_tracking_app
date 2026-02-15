
import React from 'react';
import { View, Text } from 'react-native';

import { Heart } from 'lucide-react-native';

interface WhySectionProps {
  why: string;
}

/**
 * WhySection - Featured display of user's "why"
 */
export function WhySection({ why }: WhySectionProps) {
  return (
    <View className='rounded-2xl border-l-4 border-l-rose-400 bg-rose-50 p-4'>
      <View className='mb-2 flex-row items-center gap-2'>
        <View className='h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
          <Heart className='text-rose-500' size={16} />
        </View>
        <Text className='font-semibold text-rose-800'>Your Why</Text>
      </View>
      <Text className='text-base italic leading-6 text-rose-700'>"{why}"</Text>
    </View>
  );
}
