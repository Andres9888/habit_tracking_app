/**
 * MedalCard - Single medal display card for streak records
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { MEDALS, MEDAL_COLORS } from './constants';
import { formatDate } from './utils';
import { useThemeColors } from '../../../theme/ThemeContext';

interface MedalCardProps {
  record: {
    days: number;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  };
  index: number;
  isCurrentRecord: boolean;
  pulseStyle?: AnimatedStyle<ViewStyle>;
  reduceMotion: boolean;
  isForMeasurement?: boolean;
}

export function MedalCard({
  record,
  index,
  isCurrentRecord,
  pulseStyle,
  reduceMotion,
  isForMeasurement = false,
}: MedalCardProps) {
  const { colors: themeColors } = useThemeColors();
  const colors = MEDAL_COLORS[index];
  const medal = MEDALS[index];
  const positionLabel =
    index === 0 ? 'First' : index === 1 ? 'Second' : 'Third';

  const content = (
    <>
      <Text className='mb-0.5 text-base'>{medal}</Text>
      <Text className='text-lg font-bold' style={{ color: colors.text }}>
        {record.days}
      </Text>
      <Text className='text-[9px]' style={{ color: colors.subtext }}>
        days
      </Text>
      {isCurrentRecord ? <View
          className='mt-1 rounded-full px-1.5 py-0.5'
          style={{ backgroundColor: themeColors.status.streakLight }}
        >
          <Text
            className='text-[8px] font-semibold'
            style={{ color: themeColors.status.streakText }}
          >
            NOW 🔥
          </Text>
        </View> : null}
      <Text
        className='mt-1 text-center text-[8px]'
        style={{ color: colors.subtext }}
      >
        {formatDate(record.startDate)} - {formatDate(record.endDate)}
      </Text>
    </>
  );

  const baseStyle = { backgroundColor: colors.bg, borderColor: colors.border };

  if (isForMeasurement) {
    return (
      <View
        key={`measure-${record.startDate}-${record.days}`}
        className='flex-1 items-center rounded-xl border p-2.5'
        style={baseStyle}
      >
        {content}
      </View>
    );
  }

  return (
    <Animated.View
      key={`${record.startDate}-${record.days}`}
      accessibilityLabel={`${positionLabel} best streak: ${record.days} days, from ${formatDate(record.startDate)} to ${formatDate(record.endDate)}${isCurrentRecord ? ', current streak' : ''}`}
      className='flex-1 items-center rounded-xl border p-2.5'
      style={[
        baseStyle,
        isCurrentRecord && !reduceMotion ? pulseStyle : undefined,
      ]}
    >
      {content}
    </Animated.View>
  );
}
