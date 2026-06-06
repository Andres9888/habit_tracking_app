import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekdayHeaderRowProps {
  labelColor: string;
}

export const WeekdayHeaderRow = memo(function WeekdayHeaderRow({
  labelColor,
}: WeekdayHeaderRowProps) {
  return (
    <View style={styles.row}>
      {WEEKDAY_LABELS.map((day) => (
        <View key={day} style={styles.headerCell}>
          <Text style={[styles.headerText, { color: labelColor }]}>{day}</Text>
        </View>
      ))}
    </View>
  );
});
