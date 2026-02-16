import React from 'react';
import { View, Text } from 'react-native';
import ReAnimated, { type AnimatedStyle } from 'react-native-reanimated';
import { getStrengthEmoji } from './strengthUtils';
import { useCountingPercent } from './useCountingPercent';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface StrengthProgressBarProps {
  strengthPercent: number;
  strengthEmojiAnimatedStyle: AnimatedStyle;
  progressAnimatedStyle: AnimatedStyle;
}

export function StrengthProgressBar({
  strengthPercent,
  strengthEmojiAnimatedStyle,
  progressAnimatedStyle,
}: StrengthProgressBarProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const displayPercent = useCountingPercent(strengthPercent);

  return (
    <View className='relative mb-3 flex-row items-center justify-between px-3'>
      {/* Column 1: Animated plant emoji */}
      <View className='flex-1 items-center justify-center'>
        <ReAnimated.Text
          style={[
            { fontSize: typography.heading2.fontSize, textAlign: 'center' },
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
      {/* Column 5: Animated counting percentage */}
      <View className='flex-1 items-center'>
        <Text
          className='text-[13px] font-bold'
          style={{ color: isDark ? '#A3E635' : '#4D7A0A', marginLeft: 12 }}
        >
          {displayPercent}%
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
          right: '22%',
          top: 0,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.gray[200],
            borderRadius: borderRadius.xs,
            height: 8,
            marginHorizontal: 8,
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Animated progress bar fill */}
          <ReAnimated.View
            style={[
              {
                backgroundColor: isDark ? '#A3E635' : '#4D7A0A',
                borderRadius: borderRadius.xs,
                height: '100%',
              },
              progressAnimatedStyle,
            ]}
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
