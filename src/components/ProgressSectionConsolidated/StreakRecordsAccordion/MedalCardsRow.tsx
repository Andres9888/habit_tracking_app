/**
 * MedalCardsRow - Row of medal cards with optional empty slots
 */

import React from 'react';
import { View } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { MedalCard } from './MedalCard';
import { EmptyMedalSlot } from './EmptyMedalSlot';

interface StreakRecord {
  days: number;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

interface MedalCardsRowProps {
  records: StreakRecord[];
  currentStreak: number;
  pulseStyle?: AnimatedStyle<ViewStyle>;
  reduceMotion: boolean;
  isForMeasurement?: boolean;
}

export function MedalCardsRow({
  records,
  currentStreak,
  pulseStyle,
  reduceMotion,
  isForMeasurement = false,
}: MedalCardsRowProps) {
  const keyPrefix = isForMeasurement ? 'measure' : '';

  return (
    <View className='flex-row gap-2'>
      {records.map((record, i) => {
        const isCurrentRecord =
          record.isCurrent ||
          (currentStreak > 0 && record.days === currentStreak);
        return (
          <MedalCard
            key={`${keyPrefix}${record.startDate}-${record.days}`}
            index={i}
            isCurrentRecord={isCurrentRecord}
            isForMeasurement={isForMeasurement}
            pulseStyle={pulseStyle}
            record={record}
            reduceMotion={reduceMotion}
          />
        );
      })}

      {records.length < 3 ? Array.from({ length: 3 - records.length }).map((_, i) => (
          <EmptyMedalSlot
            key={`${keyPrefix}-empty-${i}`}
            keyPrefix={`${keyPrefix}-empty`}
            medalIndex={records.length + i}
          />
        )) : null}
    </View>
  );
}
