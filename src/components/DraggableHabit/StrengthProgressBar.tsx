import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import ReAnimated from 'react-native-reanimated';
import { getStrengthEmoji } from './strengthUtils';

interface StrengthProgressBarProps {
  strengthPercent: number;
  strengthEmojiAnimatedStyle: StyleProp<ViewStyle>;
}

export function StrengthProgressBar({
  strengthPercent,
  strengthEmojiAnimatedStyle,
}: StrengthProgressBarProps) {
  return (
    <View className='relative mb-3 flex-row items-center justify-between px-3'>
      {/* Column 1: Animated plant emoji */}
      <View className='flex-1 items-center justify-center'>
        <ReAnimated.Text
          style={[
            { fontSize: 20, textAlign: 'center' },
            strengthEmojiAnimatedStyle,
          ]}
        >
          {getStrengthEmoji(strengthPercent)}
        </ReAnimated.Text>
      </View>
      {/* Grid spacers */}
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      {/* Column 5: Percentage */}
      <View className='flex-1 items-center'>
        <Text
          className='text-[13px] font-bold'
          style={{ color: '#65a30d', marginLeft: 12 }}
        >
          {Math.round(strengthPercent)}%
        </Text>
      </View>
      {/* Progress bar overlay */}
      <View
        pointerEvents='none'
        style={{
          bottom: 0,
          justifyContent: 'center',
          left: '20%',
          position: 'absolute',
          right: '20%',
          top: 0,
        }}
      >
        <View
          style={{
            backgroundColor: '#e5e7eb',
            borderRadius: 4,
            height: 8,
            marginHorizontal: 8,
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#65a30d',
              borderRadius: 4,
              height: '100%',
              width: `${strengthPercent}%`,
            }}
          />
          {/* Dividers at 20%, 40%, 60%, 80% */}
          {[20, 40, 60, 80].map((pos) => (
            <View
              key={pos}
              style={{
                backgroundColor: 'rgba(0,0,0,0.15)',
                height: '100%',
                left: `${pos}%`,
                position: 'absolute',
                top: 0,
                width: 1,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
