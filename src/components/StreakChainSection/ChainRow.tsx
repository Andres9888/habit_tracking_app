/**
 * ChainRow Component
 * Renders the 7-day streak chain with day circles and connectors
 */

import React from 'react';
import { View } from 'react-native';

import { ConnectorLine } from './ConnectorLine';
import { DayCircle } from './DayCircle';

interface ChainRowProps {
  chainData: { completed: boolean; isToday: boolean }[];
  dayLabels: string[];
  todayCompleted: boolean;
}

export function ChainRow({
  chainData,
  dayLabels,
  todayCompleted,
}: ChainRowProps) {
  return (
    <View className='mb-4 flex-row items-start'>
      {chainData.map((day, idx) => (
        <View key={idx} className='relative flex-1'>
          {idx < chainData.length - 1 && (
            <ConnectorLine
              active={day.completed && chainData[idx + 1].completed}
              index={idx}
            />
          )}
          <DayCircle
            completed={day.completed}
            index={idx}
            isToday={day.isToday}
            label={dayLabels[idx]}
            todayCompleted={todayCompleted}
          />
        </View>
      ))}
    </View>
  );
}
