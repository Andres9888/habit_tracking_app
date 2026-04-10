/**
 * Preferred time-of-day picker for template import customization
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

const TIME_OPTIONS = [
  { emoji: '🌅', label: 'Morning', value: 'morning' },
  { emoji: '☀️', label: 'Afternoon', value: 'afternoon' },
  { emoji: '🌙', label: 'Evening', value: 'evening' },
] as const;

interface PreferredTimePickerProps {
  disabled: boolean;
  selectedTime: string | null;
  onSelectTime: (time: string | null) => void;
}

export function PreferredTimePicker({
  disabled,
  selectedTime,
  onSelectTime,
}: PreferredTimePickerProps) {
  const { colors } = useThemeColors();

  return (
    <View style={pickerStyles.section}>
      <Text style={[pickerStyles.label, { color: colors.text }]}>
        When do you prefer?
      </Text>
      <View style={pickerStyles.row}>
        {TIME_OPTIONS.map((opt) => {
          const isSelected = selectedTime === opt.value;
          return (
            <Pressable
              key={opt.value}
              disabled={disabled}
              style={[
                pickerStyles.pill,
                {
                  backgroundColor: isSelected ? '#22c55e' : colors.card,
                  borderColor: isSelected ? '#22c55e' : colors.border,
                },
              ]}
              onPress={() =>
                onSelectTime(isSelected ? null : opt.value)
              }
            >
              <Text
                style={[
                  pickerStyles.pillText,
                  { color: isSelected ? '#fff' : colors.textSecondary },
                ]}
              >
                {`${opt.emoji} ${opt.label}`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
  },
  pill: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.medium,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 20,
  },
});
