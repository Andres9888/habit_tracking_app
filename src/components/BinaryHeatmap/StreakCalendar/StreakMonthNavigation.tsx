/**
 * StreakMonthNavigation Component
 *
 * Navigation buttons to move between months in the streak calendar.
 */

import React, { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { isAfter, startOfMonth, startOfToday } from 'date-fns';
import { styles } from './styles';

interface StreakMonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const StreakMonthNavigation = memo(function StreakMonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: StreakMonthNavigationProps) {
  const isNextMonthDisabled = isAfter(
    startOfMonth(currentMonth),
    startOfToday()
  );

  return (
    <View style={styles.navigationContainer}>
      <Pressable
        style={[styles.navButton]}
        onPress={onPreviousMonth}
      >
        <Text style={styles.navButtonText}>← Previous</Text>
      </Pressable>

      <Pressable
        style={[
          styles.navButton,
          isNextMonthDisabled && styles.navButtonDisabled,
        ]}
        onPress={onNextMonth}
        disabled={isNextMonthDisabled}
      >
        <Text style={styles.navButtonText}>Next →</Text>
      </Pressable>
    </View>
  );
});
