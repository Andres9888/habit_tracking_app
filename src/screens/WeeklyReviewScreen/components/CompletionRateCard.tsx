/**
 * CompletionRateCard - Shows week completion percentage
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';

interface CompletionRateCardProps {
  completionRate: number;
  totalCompletions: number;
  totalPossible: number;
  weekOverWeekChange: number;
}

export function CompletionRateCard({
  completionRate,
  totalCompletions,
  totalPossible,
  weekOverWeekChange,
}: CompletionRateCardProps) {
  const { colors } = useThemeColors();

  const changeIcon = weekOverWeekChange > 0 ? '↗' : weekOverWeekChange < 0 ? '↘' : '→';
  const changeColor = weekOverWeekChange > 0 ? '#047857' : weekOverWeekChange < 0 ? '#DC2626' : colors.text.secondary;

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        },
      ]}
    >
      <Card.Content>
        <Text style={[typography.heading2, { color: colors.text.primary }]}>
          Completion Rate
        </Text>
        
        <View style={styles.statsContainer}>
          <Text style={[typography.displayLarge, { color: '#047857', marginTop: spacing.md }]}>
            {Math.round(completionRate)}%
          </Text>
          
          <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.xs }]}>
            {totalCompletions} of {totalPossible} completed
          </Text>

          {weekOverWeekChange !== 0 && (
            <View style={styles.changeContainer}>
              <Text style={[typography.body, { color: changeColor }]}>
                {changeIcon} {Math.abs(Math.round(weekOverWeekChange))}% vs last week
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  statsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  changeContainer: {
    marginTop: spacing.sm,
  },
});
