import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

import { MEDALS, MEDAL_COLORS } from './PersonalBestsCard.constants';
import type { StreakRecord } from './types';

interface MedalRowProps {
  records: StreakRecord[];
  currentStreak: number;
  pulseAnimatedStyle: AnimatedStyle;
}

function resolveMedalColor(value: string, themeColors: ReturnType<typeof useThemeColors>['colors']): string {
  if (value === 'theme:background') return themeColors.background;
  if (value === 'theme:border') return themeColors.border;
  if (value === 'theme:text.secondary') return themeColors.text.secondary;
  if (value === 'theme:text.primary') return themeColors.text.primary;
  return value;
}

export function MedalRow({
  records,
  currentStreak,
  pulseAnimatedStyle,
}: MedalRowProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='mb-4 flex-row gap-2'>
      {records.map((record, i) => {
        const medalColors = MEDAL_COLORS[i];
        const isCurrentRecord =
          record.isCurrent ||
          (currentStreak > 0 && record.days === currentStreak);

        return (
          <Animated.View
            key={`${record.startDate}-${record.days}`}
            accessibilityLabel={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} best streak: ${record.days} days${isCurrentRecord ? ', current streak' : ''}`}
            className='flex-1 items-center rounded-xl border p-2.5'
            style={[
              {
                backgroundColor: resolveMedalColor(medalColors.bg, themeColors),
                borderColor: resolveMedalColor(medalColors.border, themeColors),
              },
              isCurrentRecord ? pulseAnimatedStyle : undefined,
            ]}
          >
            <Text className='mb-0.5 text-base'>{MEDALS[i]}</Text>
            <Text
              className='text-lg font-bold'
              style={{ color: resolveMedalColor(medalColors.text, themeColors) }}
            >
              {record.days}
            </Text>
            <Text
              className='text-[9px]'
              style={{ color: resolveMedalColor(medalColors.subtext, themeColors) }}
            >
              days
            </Text>
            {isCurrentRecord ? <View className='mt-1 rounded-full px-1.5 py-0.5' style={{ backgroundColor: themeColors.status.streakLight }}>
                <Text className='text-[8px] font-semibold' style={{ color: themeColors.status.streakText }}>
                  NOW 🔥
                </Text>
              </View> : null}
          </Animated.View>
        );
      })}
      {records.length < 3 ? Array.from({ length: 3 - records.length }).map((_, i) => (
          <View
            key={`empty-${i}`}
            className='flex-1 items-center rounded-xl border p-2.5'
            style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}
          >
            <Text className='mb-0.5 text-base opacity-30'>
              {MEDALS[records.length + i]}
            </Text>
            <Text className='text-lg font-bold' style={{ color: themeColors.text.tertiary }}>-</Text>
            <Text className='text-[9px]' style={{ color: themeColors.text.tertiary }}>days</Text>
          </View>
        )) : null}
    </View>
  );
}
