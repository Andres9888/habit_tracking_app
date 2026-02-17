/**
 * WeeklyReviewHeader - Header for weekly review screen
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';

interface WeeklyReviewHeaderProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export function WeeklyReviewHeader({ weekNumber, startDate, endDate }: WeeklyReviewHeaderProps) {
  const { colors } = useThemeColors();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.displayLarge, { color: colors.text.primary }]}>
        Week {weekNumber} Review
      </Text>
      <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.xs }]}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
});
