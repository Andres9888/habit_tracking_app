import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/theme';
import { isMonthSelectable, MONTH_NAMES } from './MonthPicker.utils';
import { useMonthPickerStyles } from './MonthPicker.styles';
import { hexToRgba } from './colors';

interface MonthPickerGridProps {
  viewYear: number;
  currentMonth: Date;
  habitColor: string;
  minDate?: Date;
  maxDate?: Date;
  onPickMonth: (monthIndex: number) => void;
}

export const MonthPickerGrid = memo(function MonthPickerGrid({
  viewYear,
  currentMonth,
  habitColor,
  minDate,
  maxDate,
  onPickMonth,
}: MonthPickerGridProps) {
  const styles = useMonthPickerStyles();
  const { colors, isDark } = useThemeColors();
  const selectedBg = habitColor;
  const idleBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : hexToRgba(habitColor, 0.08);

  return (
    <View style={styles.grid}>
      {MONTH_NAMES.map((name, index) => {
        const enabled = isMonthSelectable(viewYear, index, minDate, maxDate);
        const selected =
          currentMonth.getFullYear() === viewYear &&
          currentMonth.getMonth() === index;
        return (
          <Pressable
            key={name}
            accessibilityLabel={`${name} ${viewYear}`}
            accessibilityRole='button'
            accessibilityState={{ disabled: !enabled, selected }}
            disabled={!enabled}
            style={[
              styles.monthBtn,
              { backgroundColor: selected ? selectedBg : idleBg },
              !enabled && styles.disabled,
            ]}
            onPress={() => onPickMonth(index)}
          >
            <Text
              style={[
                styles.monthText,
                {
                  color: selected ? colors.text.inverse : colors.text.primary,
                },
              ]}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
