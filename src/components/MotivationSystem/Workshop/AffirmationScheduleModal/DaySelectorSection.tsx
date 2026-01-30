/**
 * DaySelectorSection Component
 * Container for day selection with label
 */

import React from 'react';
import { View, Text } from 'react-native';
import { formatDaysOfWeek } from '../../../../utils/notifications';
import { DaySelector } from './DaySelector';

interface DaySelectorSectionProps {
  daysOfWeek: number[];
  onToggleDay: (day: number) => void;
}

export function DaySelectorSection({
  daysOfWeek,
  onToggleDay,
}: DaySelectorSectionProps) {
  return (
    <View className='mb-6'>
      <DaySelector selectedDays={daysOfWeek} onToggleDay={onToggleDay} />
      <Text className='mt-2 text-xs text-stone-500'>
        Selected: {formatDaysOfWeek(daysOfWeek)}
      </Text>
    </View>
  );
}

export default DaySelectorSection;
