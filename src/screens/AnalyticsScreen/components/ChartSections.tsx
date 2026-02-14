/**
 * ChartSections - Analytics chart components (Strength, Trend, Heatmap)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import StrengthDistributionChart from '../../../components/StrengthDistributionChart';
import type { StrengthDistributionData } from '../../../components/StrengthDistributionChart/StrengthDistributionChart.types';
import TrendLineChart from '../../../components/TrendLineChart';
import type { TrendData } from '../../../components/TrendLineChart/types';
import ComplianceHeatmap from '../../../components/ComplianceHeatmap';
import type { HeatmapData } from '../../../components/ComplianceHeatmap/ComplianceHeatmap.types';
import { ChartLoadingSkeleton } from './ChartLoadingSkeleton';

interface ChartSectionsProps {
  strengthDistribution: StrengthDistributionData | undefined;
  trendData: TrendData[] | undefined;
  complianceData: HeatmapData[] | undefined;
  isLoading?: boolean;
}

export const ChartSections: React.FC<ChartSectionsProps> = ({
  strengthDistribution,
  trendData,
  complianceData,
  isLoading = false,
}) => {
  const strengthAccessibilityLabel = strengthDistribution
    ? `Habit strength distribution: ${strengthDistribution.automatic.count} automatic, ${strengthDistribution.strong.count} strong, ${strengthDistribution.developing.count} developing, ${strengthDistribution.building.count} building, ${strengthDistribution.starting.count} starting habits`
    : 'Loading chart';

  if (isLoading) {
    return (
      <>
        <ChartLoadingSkeleton />
        <ChartLoadingSkeleton />
        <ChartLoadingSkeleton />
      </>
    );
  }

  return (
    <>
      <View accessible accessibilityRole='none' style={styles.section}>
        <Text
          accessibilityLabel='Strength Distribution Chart'
          accessibilityRole='header'
          style={styles.sectionTitle}
        >
          Strength Distribution
        </Text>
        <View accessible accessibilityLabel={strengthAccessibilityLabel}>
          <StrengthDistributionChart
            data={strengthDistribution ?? null}
            onSegmentPress={(_level) => { /* TODO: wire up filter by level */ }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>30-Day Trend</Text>
        <TrendLineChart
          data={trendData ?? null}
          onDataPointPress={(_point) => { /* TODO: wire up data point selection */ }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Heatmap</Text>
        <ComplianceHeatmap
          data={complianceData ?? null}
          onDayPress={(_day) => { /* TODO: wire up day selection */ }}
        />
      </View>
    </>
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
