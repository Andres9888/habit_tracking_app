/**
 * CalendarSummary - Monthly completion stats below the calendar grid.
 * Shows completed count, missed count, and completion rate.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';

interface CalendarSummaryProps {
  borderColor: string;
  completed: number;
  habitColor: string;
  missed: number;
  textColor: string;
}

export const CalendarSummary = memo(function CalendarSummary({
  borderColor,
  completed,
  habitColor,
  missed,
  textColor,
}: CalendarSummaryProps) {
  const total = completed + missed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={[summaryStyles.row, { borderTopColor: borderColor }]}>
      <View style={summaryStyles.item}>
        <View style={[summaryStyles.dot, { backgroundColor: habitColor }]} />
        <Text style={[summaryStyles.text, { color: textColor }]}>
          {completed} completed
        </Text>
      </View>

      <Text style={[summaryStyles.separator, { color: borderColor }]}>·</Text>

      <View style={summaryStyles.item}>
        <View
          style={[
            summaryStyles.dot,
            {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: habitColor,
            },
          ]}
        />
        <Text style={[summaryStyles.text, { color: textColor }]}>
          {missed} missed
        </Text>
      </View>

      <Text style={[summaryStyles.separator, { color: borderColor }]}>·</Text>

      <Text style={[summaryStyles.rateText, { color: habitColor }]}>
        {rate}%
      </Text>
    </View>
  );
});

const summaryStyles = StyleSheet.create({
  dot: {
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  rateText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.bold,
    minWidth: 32,
    textAlign: 'right',
  },
  row: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
  },
  separator: {
    fontSize: 13,
  },
  text: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.medium,
  },
});
