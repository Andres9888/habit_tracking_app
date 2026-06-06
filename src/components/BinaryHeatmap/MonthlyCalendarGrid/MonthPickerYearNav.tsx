import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { useMonthPickerStyles } from './MonthPicker.styles';

interface MonthPickerYearNavProps {
  viewYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

export const MonthPickerYearNav = memo(function MonthPickerYearNav({
  viewYear,
  onPreviousYear,
  onNextYear,
}: MonthPickerYearNavProps) {
  const { colors } = useThemeColors();
  const styles = useMonthPickerStyles();
  const iconColor = colors.text.secondary;

  return (
    <View style={styles.yearRow}>
      <Pressable
        accessibilityLabel='Previous year'
        accessibilityRole='button'
        hitSlop={8}
        style={[styles.navButton, { borderColor: colors.border }]}
        onPress={onPreviousYear}
      >
        <ChevronLeft color={iconColor} size={iconSizes.medium} />
      </Pressable>
      <Text style={styles.yearLabel}>{viewYear}</Text>
      <Pressable
        accessibilityLabel='Next year'
        accessibilityRole='button'
        hitSlop={8}
        style={[styles.navButton, { borderColor: colors.border }]}
        onPress={onNextYear}
      >
        <ChevronRight color={iconColor} size={iconSizes.medium} />
      </Pressable>
    </View>
  );
});
