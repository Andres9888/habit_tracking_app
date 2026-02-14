/**
 * ChainRow Component
 * Renders the 7-day streak chain with day circles and connectors
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { DayCircle } from './DayCircle';
import { ConnectorLine } from './ConnectorLine';

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
    <View style={localStyles.row}>
      {chainData.map((day, idx) => (
        <View key={idx} style={localStyles.dayWrapper}>
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

const localStyles = StyleSheet.create({
  dayWrapper: {
    flex: 1,
    position: 'relative',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: spacing.base,
  },
});
