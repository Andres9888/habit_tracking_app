import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

import { MEDALS, MEDAL_COLORS } from './PersonalBestsCard.constants';
import type { StreakRecord } from './types';

interface MedalRowProps {
  records: StreakRecord[];
  currentStreak: number;
  pulseAnimatedStyle: AnimatedStyleProp<ViewStyle>;
}

export function MedalRow({
  records,
  currentStreak,
  pulseAnimatedStyle,
}: MedalRowProps) {
  return (
    <View className='mb-4 flex-row gap-2'>
      {records.map((record, i) => {
        const colors = MEDAL_COLORS[i];
        const isCurrentRecord =
          record.isCurrent ||
          (currentStreak > 0 && record.days === currentStreak);

        return (
          <Animated.View
            key={`${record.startDate}-${record.days}`}
            accessibilityLabel={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} best streak: ${record.days} days${isCurrentRecord ? ', current streak' : ''}`}
            className={`flex-1 items-center rounded-xl border p-2.5 ${colors.bg} ${colors.border}`}
            style={isCurrentRecord ? pulseAnimatedStyle : undefined}
          >
            <Text className='mb-0.5 text-base'>{MEDALS[i]}</Text>
            <Text className={`text-lg font-bold ${colors.text}`}>
              {record.days}
            </Text>
            <Text className={`text-[9px] ${colors.subtext}`}>days</Text>
            {isCurrentRecord && (
              <View className='mt-1 rounded-full bg-orange-100 px-1.5 py-0.5'>
                <Text className='text-[8px] font-semibold text-orange-700'>
                  NOW 🔥
                </Text>
              </View>
            )}
          </Animated.View>
        );
      })}
      {records.length < 3 &&
        Array.from({ length: 3 - records.length }).map((_, i) => (
          <View
            key={`empty-${i}`}
            className='flex-1 items-center rounded-xl border border-stone-100 bg-stone-50/50 p-2.5'
          >
            <Text className='mb-0.5 text-base opacity-30'>
              {MEDALS[records.length + i]}
            </Text>
            <Text className='text-lg font-bold text-stone-300'>-</Text>
            <Text className='text-[9px] text-stone-300'>days</Text>
          </View>
        ))}
    </View>
  );
}
