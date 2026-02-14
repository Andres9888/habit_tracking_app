/**
 * ChartSections - Analytics chart components (Strength, Trend, Heatmap)
 * Theme-aware for dark mode support.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();

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

  const sectionTitleStyle = [styles.sectionTitle, { color: colors.text.primary }];

  return (
    <>
      <View accessible accessibilityRole='none' style={styles.section}>
        <Text
          accessibilityLabel='Strength Distribution Chart'
          accessibilityRole='header'
          style={sectionTitleStyle}
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

      <View style={styles.section}>
        <Text style={sectionTitleStyle}>30-Day Trend</Text>
        <TrendLineChart data={trendData ?? null} onDataPointPress={undefined} />
      </View>

      <View style={styles.section}>
        <Text style={sectionTitleStyle}>Compliance Heatmap</Text>
        <ComplianceHeatmap
          data={complianceData ?? null}
          onDayPress={undefined}
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
    marginBottom: spacing.md,
  },
});
