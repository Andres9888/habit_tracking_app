/**
 * Days-of-week chip picker for template import customization
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

const DAYS = [
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
  { label: 'S', value: 0 },
] as const;

interface DaysOfWeekPickerProps {
  disabled: boolean;
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

export function DaysOfWeekPicker({
  disabled,
  selectedDays,
  onToggleDay,
}: DaysOfWeekPickerProps) {
  const { colors } = useThemeColors();

  return (
    <View style={dayStyles.section}>
      <Text style={[dayStyles.label, { color: colors.text }]}>
        Which days?
      </Text>
      <View style={dayStyles.row}>
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <Pressable
              key={day.value}
              disabled={disabled}
              style={[
                dayStyles.chip,
                {
                  backgroundColor: isSelected ? '#22c55e' : colors.card,
                  borderColor: isSelected ? '#22c55e' : colors.border,
                },
              ]}
              onPress={() => onToggleDay(day.value)}
            >
              <Text
                style={[
                  dayStyles.chipText,
                  { color: isSelected ? '#fff' : colors.textSecondary },
                ]}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const dayStyles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 19,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  chipText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
  },
});
