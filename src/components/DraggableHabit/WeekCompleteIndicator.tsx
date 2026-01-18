import React from 'react';
import { View, Text } from 'react-native';

interface WeekCompleteIndicatorProps {
  accentColor: string;
}

export function WeekCompleteIndicator({
  accentColor,
}: WeekCompleteIndicatorProps) {
  return (
    <View
      className='mt-3 flex-row items-center justify-center gap-1.5 rounded-full py-1.5'
      style={{
        backgroundColor: `${accentColor}15`, // 15% opacity accent color
      }}
    >
      <Text className='text-[10px]'>✨</Text>
      <Text
        className='text-[10px] font-medium uppercase tracking-wider'
        style={{ color: accentColor }}
      >
        Perfect Week
      </Text>
      <Text className='text-[10px]'>✨</Text>
    </View>
  );
}
