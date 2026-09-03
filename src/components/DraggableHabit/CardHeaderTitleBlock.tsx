import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors as palette } from '@/theme';
import { PhaseTag } from '../PhaseTag';
import type { CardColors, Habit } from './types';
import {
  getChevronColor,
  getTitleColumnStyle,
  getTitleTextStyle,
} from './CardHeader.styles';

interface CardHeaderTitleBlockProps {
  colors: CardColors;
  habit: Habit;
  isCompactMode?: boolean;
  isPaused: boolean;
  name: string;
  showBestStreak: boolean;
  bestStreak: number;
  tertiaryTextColor: string;
}

export function CardHeaderTitleBlock({
  colors,
  habit,
  isCompactMode,
  isPaused,
  name,
  showBestStreak,
  bestStreak,
  tertiaryTextColor,
}: CardHeaderTitleBlockProps) {
  return (
    <View>
      <View style={getTitleColumnStyle(isCompactMode)}>
        <View className='flex-row items-center gap-2'>
          <Text
            className='shrink'
            ellipsizeMode='tail'
            numberOfLines={2}
            style={[
              getTitleTextStyle(isCompactMode),
              { color: colors.primaryText },
            ]}
          >
            {name || habit.name}
          </Text>
          {habit.preferredTime ? (
            <PhaseTag compact preferredTime={habit.preferredTime} />
          ) : null}
          {isPaused ? (
            <View
              className='rounded-full px-2 py-0.5'
              style={{ backgroundColor: palette.premium[400] }}
            >
              <Text className='text-xs font-semibold text-white'>Paused</Text>
            </View>
          ) : null}
          <ChevronRight
            color={getChevronColor()}
            size={isCompactMode ? 14 : 16}
            strokeWidth={2.2}
            style={{ flexShrink: 0 }}
          />
        </View>
      </View>
      {showBestStreak ? (
        <Text
          className='mt-0.5 text-sm font-medium'
          style={{ color: tertiaryTextColor }}
        >
          Best: {bestStreak} days
        </Text>
      ) : null}
    </View>
  );
}
