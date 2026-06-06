/**
 * MonthPicker - bottom sheet for jumping to a month in the calendar grid.
 */

import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { setMonth as setMonthIndex, setYear, startOfMonth } from 'date-fns';
import Modal from '@/components/Modal';
import { useThemeColors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useMonthPickerStyles } from './MonthPicker.styles';
import { MonthPickerGrid } from './MonthPickerGrid';
import { MonthPickerYearNav } from './MonthPickerYearNav';

interface MonthPickerProps {
  visible: boolean;
  currentMonth: Date;
  habitColor: string;
  minDate?: Date;
  maxDate?: Date;
  onClose: () => void;
  onSelectMonth: (month: Date) => void;
}

export const MonthPicker = memo(function MonthPicker({
  visible,
  currentMonth,
  habitColor,
  minDate,
  maxDate,
  onClose,
  onSelectMonth,
}: MonthPickerProps) {
  const { colors } = useThemeColors();
  const styles = useMonthPickerStyles();
  const [viewYear, setViewYear] = useState(() => currentMonth.getFullYear());

  useEffect(() => {
    if (visible) setViewYear(currentMonth.getFullYear());
  }, [visible, currentMonth]);

  const pickMonth = useCallback(
    (monthIndex: number) => {
      void triggerHaptic('selection');
      onSelectMonth(
        startOfMonth(setMonthIndex(setYear(new Date(), viewYear), monthIndex))
      );
      onClose();
    },
    [onClose, onSelectMonth, viewYear]
  );

  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose month</Text>
          <Pressable
            accessibilityLabel='Close month picker'
            accessibilityRole='button'
            hitSlop={12}
            onPress={onClose}
          >
            <X
              color={colors.text.secondary}
              size={iconSizes.large}
              strokeWidth={2}
            />
          </Pressable>
        </View>
        <View style={styles.divider} />
        <MonthPickerYearNav
          viewYear={viewYear}
          onNextYear={() => setViewYear((y) => y + 1)}
          onPreviousYear={() => setViewYear((y) => y - 1)}
        />
        <MonthPickerGrid
          currentMonth={currentMonth}
          habitColor={habitColor}
          maxDate={maxDate}
          minDate={minDate}
          viewYear={viewYear}
          onPickMonth={pickMonth}
        />
      </View>
    </Modal>
  );
});
