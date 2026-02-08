import React from 'react';
import { View, Text, Animated } from 'react-native';
import type { ProgressColors } from './types';

interface CompactMeterProps {
  percentage: number;
  colors: ProgressColors;
  progressScaleX: Animated.AnimatedInterpolation<number>;
}

export function CompactMeter({
  percentage,
  colors,
  progressScaleX,
}: CompactMeterProps) {
  return (
    <View className='flex-row items-center gap-2'>
      <View
        className='h-2 flex-1 overflow-hidden rounded-full'
        style={{ backgroundColor: '#e7e5e4' }}
      >
        <Animated.View
          className='h-full rounded-full'
          style={{
            backgroundColor: colors.fill,
            transform: [{ scaleX: progressScaleX }],
            transformOrigin: 'left center',
            width: '100%',
          }}
        />
      </View>
      <Text
        className='text-[13px] font-bold tabular-nums'
        style={{ color: colors.text, minWidth: 32, textAlign: 'right' }}
      >
        {percentage}%
      </Text>
    </View>
  );
}
