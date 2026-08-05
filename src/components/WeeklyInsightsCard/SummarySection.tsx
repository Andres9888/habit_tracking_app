/**
 * SummarySection Component
 * Shows week-over-week summary with overall change and total completions
 */

import React from 'react';
import { View, Text } from 'react-native';
import {
  Calendar,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { iconSizes } from '@/theme/iconSizes';
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
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <AnimatedPressable
      accessibilityLabel={`This Week's Summary. Overall change: ${insights.weekOverWeekChange > 0 ? '+' : ''}${Math.round(insights.weekOverWeekChange)}%`}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      style={styles.section}
      onPress={onToggle}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Calendar color={colors.primary[500]} size={iconSizes.medium} />
          <Text style={styles.sectionTitle}>This Week's Summary</Text>
        </View>
        {isExpanded ? (
          <ChevronUp color={colors.text.tertiary} size={iconSizes.medium} />
        ) : (
          <ChevronDown color={colors.text.tertiary} size={iconSizes.medium} />
        )}
      </View>

      {isExpanded ? <View style={styles.sectionContent}>
          <View style={summaryStyles.summaryCard}>
            <View style={summaryStyles.summaryRow}>
              <Text style={summaryStyles.summaryLabel}>Overall Change</Text>
              <View style={summaryStyles.summaryValueContainer}>
                <ChangeIcon color={changeColor} size={iconSizes.small} />
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
        </View> : null}
    </AnimatedPressable>
  );
}
