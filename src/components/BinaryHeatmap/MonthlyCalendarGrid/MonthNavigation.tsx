/**
 * MonthNavigation Component
 *
 * Month display and navigation controls for the calendar.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { COLORS } from './colors';
import { styles } from './styles';

interface MonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  return (
    <View style={styles.navigation}>
      <Pressable style={styles.monthButton}>
        <Calendar color={COLORS.TEXT_SECONDARY} size={16} />
        <Text style={styles.monthText}>{format(currentMonth, 'MMM yyyy')}</Text>
      </Pressable>
      <View style={styles.navButtons}>
        <Pressable style={styles.navButton} onPress={onPreviousMonth}>
          <ChevronLeft color={COLORS.TEXT_SECONDARY} size={20} />
        </Pressable>
        <Pressable style={styles.navButton} onPress={onNextMonth}>
          <ChevronRight color={COLORS.TEXT_SECONDARY} size={20} />
        </Pressable>
      </View>
    </View>
  );
});
