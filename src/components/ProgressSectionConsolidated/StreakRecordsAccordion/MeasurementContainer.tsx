/**
 * MeasurementContainer - Hidden container for measuring content height
 */

import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { MedalCardsRow } from './MedalCardsRow';
import type { StreakRecord } from '../types';

interface MeasurementContainerProps {
  currentStreak: number;
  records: StreakRecord[];
  reduceMotion: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
}

export function MeasurementContainer({
  currentStreak,
  records,
  reduceMotion,
  onLayout,
}: MeasurementContainerProps) {
  return (
    <View
      accessibilityElementsHidden
      className='absolute opacity-0'
      importantForAccessibility='no-hide-descendants'
      pointerEvents='none'
      onLayout={onLayout}
    >
      <View className='px-3 pb-3'>
        <MedalCardsRow
          isForMeasurement
          currentStreak={currentStreak}
          records={records}
          reduceMotion={reduceMotion}
        />
      </View>
    </View>
  );
}
