/**
 * VizHeader - Header with animated icon for visualization display
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { VizType } from './types';

interface VizHeaderProps {
  vizType: VizType;
  iconAnimatedStyle: object;
}

export function VizHeader({ vizType, iconAnimatedStyle }: VizHeaderProps) {
  const isSuccess = vizType === 'success';

  return (
    <View className='mb-4 flex-row items-center gap-3'>
      <Animated.View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          isSuccess ? 'bg-emerald-100' : 'bg-rose-100'
        )}
        style={iconAnimatedStyle}
      >
        {isSuccess ? (
          <Sparkles className='text-emerald-600' size={20} />
        ) : (
          <AlertTriangle className='text-rose-600' size={20} />
        )}
      </Animated.View>
      <View className='flex-1'>
        <Text
          className={clsx(
            'text-base font-semibold',
            isSuccess ? 'text-emerald-800' : 'text-rose-800'
          )}
        >
          {isSuccess ? 'Visualize Success' : 'Visualize Consequences'}
        </Text>
        <Text className='text-xs text-stone-500'>
          {isSuccess
            ? 'Feel the energy of completing this'
            : 'Feel the weight of skipping this'}
        </Text>
      </View>
    </View>
  );
}
