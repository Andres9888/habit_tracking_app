/**
 * ScheduleIndicator Component
 * Shows next delivery time for scheduled affirmations
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Clock } from 'lucide-react-native';

import type { AffirmationFrequency } from '../AffirmationsSection.types';
import { formatDaysOfWeek } from '../../../../../utils/notifications';

interface ScheduleIndicatorProps {
  nextDelivery: string;
  frequency?: AffirmationFrequency;
  daysOfWeek?: number[];
}

export function ScheduleIndicator({
  nextDelivery,
  frequency,
  daysOfWeek,
}: ScheduleIndicatorProps) {
  return (
    <View className='mt-2 flex-row items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1'>
      <Clock className='text-emerald-500' size={12} />
      <Text className='text-xs text-emerald-700'>
        Next: {nextDelivery}
        {frequency === 'weekly' &&
          daysOfWeek &&
          ` • ${formatDaysOfWeek(daysOfWeek)}`}
      </Text>
    </View>
  );
}
