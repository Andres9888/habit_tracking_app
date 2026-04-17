/* eslint-disable max-lines */
/**
 * StrengthProgressBar — Visualises habit strength as an animated segmented bar.
 *
 * Layout (same 5-column grid as CardHeader):
 * - Column 1: Animated tier emoji (🌱→🌿→🌳→💪→⚡)
 * - Columns 2–4: Progress bar with dividers at 20/40/60/80%
 * - Column 5: Animated counting percentage text
 */

import React from 'react';
import { View, Text } from 'react-native';
import ReAnimated, { type AnimatedStyle } from 'react-native-reanimated';
import { getStrengthEmoji } from './strengthUtils';
import { useCountingPercent } from './useCountingPercent';
import { colors } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies } from '../../theme/typography';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';

interface StrengthProgressBarProps {
  strengthPercent: number;
  strengthEmojiAnimatedStyle: AnimatedStyle;
  progressAnimatedStyle: AnimatedStyle;
  emojis?: ProgressEmojiSet;
}

export function StrengthProgressBar({
  strengthPercent,
  strengthEmojiAnimatedStyle,
  progressAnimatedStyle,
  emojis,
}: StrengthProgressBarProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const displayPercent = useCountingPercent(strengthPercent);

  return (
    <View className='relative mb-3 flex-row items-center justify-between px-3'>
      {/* Column 1: Animated plant emoji — h-9 w-9 matches CardHeader icon */}
      <View className='flex-1 items-center justify-center'>
        <View className='h-9 w-9 items-center justify-center'>
          <ReAnimated.Text
            style={[
              { fontFamily: fontFamilies.primary.text },
              { fontSize: typography.heading2.fontSize, textAlign: 'center' },
              strengthEmojiAnimatedStyle,
            ]}
          >
            {getStrengthEmoji(strengthPercent, emojis)}
          </ReAnimated.Text>
        </View>
      </View>
      {/* Grid spacers */}
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      {/* Column 5: Animated counting percentage */}
      <View className='flex-1 items-center'>
        <Text
          className='text-[13px] font-bold'
          style={{
            color: isDark ? '#A3E635' : colors.strength.starting,
            marginLeft: 12,
          }}
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
                backgroundColor: isDark ? '#A3E635' : colors.strength.starting,
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
