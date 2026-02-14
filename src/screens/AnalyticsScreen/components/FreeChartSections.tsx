/**
 * FreeChartSections - Charts available to free users
 * Shows 30-Day Trend (completion rate over time) and current streaks
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import TrendLineChart from '../../../components/TrendLineChart';
import type { TrendData } from '../../../components/TrendLineChart/types';
import { ChartLoadingSkeleton } from './ChartLoadingSkeleton';

interface FreeChartSectionsProps {
  trendData: TrendData[] | undefined;
  isLoading?: boolean;
}

export const FreeChartSections: React.FC<FreeChartSectionsProps> = ({
  trendData,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ChartLoadingSkeleton />;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>30-Day Trend</Text>
      <TrendLineChart data={trendData ?? null} onDataPointPress={undefined} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
});
