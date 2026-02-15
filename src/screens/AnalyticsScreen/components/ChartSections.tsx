/**
 * ChartSections - Analytics chart components (Strength, Trend, Heatmap)
 * Theme-aware with dark mode support
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
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

const anim = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

export const ChartSections: React.FC<ChartSectionsProps> = ({
  strengthDistribution,
  trendData,
  complianceData,
  isLoading = false,
}) => {
  const { colors: tc, isDark } = useThemeColors();

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

  const sectionTitleStyle = {
    color: tc.text.primary,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  };

  const chartCardStyle = {
    backgroundColor: tc.card,
    borderColor: tc.cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: isDark ? '#000000' : '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
    elevation: 3,
  };

  return (
    <>
      <Animated.View
        accessible
        accessibilityRole='none'
        entering={anim(0)}
        style={styles.section}
      >
        <Text
          accessibilityLabel='Strength Distribution Chart'
          accessibilityRole='header'
          style={sectionTitleStyle}
        >
          Strength Distribution
        </Text>
        <View accessible accessibilityLabel={strengthAccessibilityLabel} style={chartCardStyle}>
          <StrengthDistributionChart
            data={strengthDistribution ?? null}
            onSegmentPress={undefined}
          />
        </View>
      </Animated.View>

      <Animated.View entering={anim(60)} style={styles.section}>
        <Text style={sectionTitleStyle}>30-Day Trend</Text>
        <View style={chartCardStyle}>
          <TrendLineChart data={trendData ?? null} onDataPointPress={undefined} />
        </View>
      </Animated.View>

      <Animated.View entering={anim(120)} style={styles.section}>
        <Text style={sectionTitleStyle}>Compliance Heatmap</Text>
        <View style={chartCardStyle}>
          <ComplianceHeatmap
            data={complianceData ?? null}
            onDayPress={undefined}
          />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
