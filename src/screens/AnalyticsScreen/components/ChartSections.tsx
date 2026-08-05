/**
 * ChartSections - Analytics chart components (Strength, Trend, Heatmap)
 */
import React, { memo } from 'react';
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

interface ChartSectionsProps { strengthDistribution: StrengthDistributionData | undefined; trendData: TrendData[] | undefined; complianceData: HeatmapData[] | undefined; isLoading?: boolean; }

export const ChartSections = memo(function ChartSections({
  strengthDistribution,
  trendData,
  complianceData,
  isLoading = false,
}: ChartSectionsProps) {
  const strengthAccessibilityLabel = strengthDistribution
    ? `Habit strength distribution: ${strengthDistribution.automatic.count} automatic, ${strengthDistribution.strong.count} strong, ${strengthDistribution.developing.count} developing, ${strengthDistribution.building.count} building, ${strengthDistribution.starting.count} starting habits`
    : 'Loading chart';
  const latestTrendPoint = trendData?.at(-1);

  if (isLoading) return <><ChartLoadingSkeleton /><ChartLoadingSkeleton /><ChartLoadingSkeleton /></>;

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
            onSegmentPress={undefined}
          />
        </View>
      </View>

      <View accessible accessibilityRole='none' style={styles.section}>
        <Text
          accessibilityLabel='30-Day Trend Chart'
          accessibilityRole='header'
          style={styles.sectionTitle}
        >
          30-Day Trend
        </Text>
        <View
          accessible
          accessibilityLabel={
            trendData && trendData.length > 0
              ? `Trend chart showing ${trendData.length} days of data. Latest average strength: ${Math.round(latestTrendPoint?.averageStrength ?? 0)}%`
              : 'No trend data available'
          }
        >
          <TrendLineChart data={trendData ?? null} onDataPointPress={undefined} />
        </View>
      </View>

      <View accessible accessibilityRole='none' style={styles.section}>
        <Text
          accessibilityLabel='Compliance Heatmap Chart'
          accessibilityRole='header'
          style={styles.sectionTitle}
        >
          Compliance Heatmap
        </Text>
        <View
          accessible
          accessibilityLabel={
            complianceData && complianceData.length > 0
              ? `Heatmap showing habit completion over ${complianceData.length} days`
              : 'No compliance data available'
          }
        >
          <ComplianceHeatmap
            data={complianceData ?? null}
            onDayPress={undefined}
          />
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl, paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.heading3, color: colors.text.primary, marginBottom: spacing.md },
});
