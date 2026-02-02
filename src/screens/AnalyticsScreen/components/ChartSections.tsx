/**
 * ChartSections - Analytics chart components (Strength, Trend, Heatmap)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import StrengthDistributionChart from '../../../components/StrengthDistributionChart';
import TrendLineChart from '../../../components/TrendLineChart';
import ComplianceHeatmap from '../../../components/ComplianceHeatmap';
import type { StrengthDistributionData } from '../../../components/StrengthDistributionChart/StrengthDistributionChart.types';
import type { TrendData } from '../../../components/TrendLineChart/types';
import type { HeatmapData } from '../../../components/ComplianceHeatmap/ComplianceHeatmap.types';

interface ChartSectionsProps {
  strengthDistribution: StrengthDistributionData | undefined;
  trendData: TrendData[] | undefined;
  complianceData: HeatmapData[] | undefined;
}

export const ChartSections: React.FC<ChartSectionsProps> = ({
  strengthDistribution,
  trendData,
  complianceData,
}) => {
  const strengthAccessibilityLabel = strengthDistribution
    ? `Habit strength distribution: ${strengthDistribution.automatic.count} automatic, ${strengthDistribution.strong.count} strong, ${strengthDistribution.developing.count} developing, ${strengthDistribution.building.count} building, ${strengthDistribution.starting.count} starting habits`
    : 'Loading chart';

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
            onSegmentPress={(level) => console.log('Filter by level:', level)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>30-Day Trend</Text>
        <TrendLineChart
          data={trendData ?? null}
          onDataPointPress={(point) => console.log('Selected point:', point)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Heatmap</Text>
        <ComplianceHeatmap
          data={complianceData ?? null}
          onDayPress={(day) => console.log('Selected day:', day)}
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
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
});
