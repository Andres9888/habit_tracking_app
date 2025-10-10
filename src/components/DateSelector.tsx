import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface DateSelectorProps {
  dates: Date[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({ dates }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  return (
    <View style={styles.container}>
      {dates.map((date, index) => {
        const isCurrent = isToday(date);
        const month = format(date, 'MMM').toUpperCase();
        const day = format(date, 'd');
        const weekday = format(date, 'EEE').toUpperCase();

        const accessibilityLabel = isCurrent
          ? `Today, ${weekday} ${month} ${day}`
          : `${weekday} ${month} ${day}`;

        return (
          <View
            key={index}
            style={styles.dayColumn}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="text"
          >
            <Text style={[styles.monthText, isCurrent && styles.currentText]}>
              {month}
            </Text>
            <Text style={[styles.dayNumber, isCurrent && styles.currentText]}>
              {day}
            </Text>
            <Text style={[styles.weekdayText, isCurrent && styles.currentText]}>
              {weekday}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingVertical: 0,
    height: 80,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
    width: 40,
  },
  monthText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#a0aec0',
    textAlign: 'center',
  },
  dayNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#a0aec0',
    lineHeight: 36,
    textAlign: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    color: '#a0aec0',
    textAlign: 'center',
  },
  currentText: {
    color: '#101727',
  },
});
