/**
 * SummarySection Component
 * Shows week-over-week summary with overall change and total completions
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../theme/colors';
import type { WeeklyInsights } from './WeeklyInsightsCard.types';
import { styles } from './WeeklyInsightsCard.styles';
import { summaryStyles } from './SummarySection.styles';

interface SummarySectionProps {
  insights: WeeklyInsights;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SummarySection({
  insights,
  isExpanded,
  onToggle,
}: SummarySectionProps) {
  const isPositive = insights.weekOverWeekChange >= 0;
  const changeColor = isPositive ? colors.success : colors.error;
  const changeIcon = isPositive ? 'trending-up' : 'trending-down';

  return (
    <AnimatedPressable style={styles.section} onPress={onToggle}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Ionicons color={colors.primary[500]} name='calendar' size={20} />
          <Text style={styles.sectionTitle}>This Week's Summary</Text>
        </View>
        <Ionicons
          color={colors.text.tertiary}
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
        />
      </View>

      {isExpanded && (
        <View style={styles.sectionContent}>
          <View style={summaryStyles.summaryCard}>
            <View style={summaryStyles.summaryRow}>
              <Text style={summaryStyles.summaryLabel}>Overall Change</Text>
              <View style={summaryStyles.summaryValueContainer}>
                <Ionicons color={changeColor} name={changeIcon} size={16} />
                <Text
                  style={[summaryStyles.summaryValue, { color: changeColor }]}
                >
                  {insights.weekOverWeekChange > 0 ? '+' : ''}
                  {Math.round(insights.weekOverWeekChange)}%
                </Text>
              </View>
            </View>
            <View style={summaryStyles.summaryDivider} />
            <View style={summaryStyles.summaryRow}>
              <Text style={summaryStyles.summaryLabel}>Total Completions</Text>
              <Text style={summaryStyles.summaryCompletions}>
                {insights.totalCompletionsThisWeek} this week •{' '}
                {insights.totalCompletionsLastWeek} last week
              </Text>
            </View>
          </View>
        </View>
      )}
    </AnimatedPressable>
  );
}
