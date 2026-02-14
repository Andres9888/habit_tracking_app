/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 */
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { colors } from '../../theme/colors';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { AnalyticsScreenSkeleton } from '../../components/SkeletonLoader';
import { useAnalyticsScreen } from './AnalyticsScreen.hooks';
import { styles } from './AnalyticsScreen.styles';
import {
  AnalyticsHeader,
  EmptyState,
  OverviewStats,
  ChartSections,
  InsightsSections,
  ExportButton,
  ExportMenu,
} from './components';

export default function AnalyticsScreen() {
  const {
    refreshing,
    showPaywall,
    showExportMenu,
    isPremiumUser,
    isLoading,
    overviewStats,
    strengthDistribution,
    trendData,
    complianceData,
    weeklyInsights,
    onRefresh,
    handleHabitPress,
    handleExportPress,
    handleExport,
    handleStartTrial,
    setShowPaywall,
    setShowExportMenu,
  } = useAnalyticsScreen();

  // Show paywall modal if not premium user
  if (!isPremiumUser && showPaywall) {
    return (
      <PremiumPaywall
        visible
        variant='analytics'
        onClose={() => setShowPaywall(false)}
        onStartTrial={handleStartTrial}
      />
    );
  }

  if (isLoading) {
    return <AnalyticsScreenSkeleton />;
  }

  const hasNoHabits = overviewStats?.totalHabits === 0;

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          colors={[colors.primary[500]]}
          refreshing={refreshing}
          tintColor={colors.primary[500]}
          onRefresh={() => void onRefresh()}
        />
      }
      style={styles.container}
    >
      <AnalyticsHeader />

      {hasNoHabits && <EmptyState />}

      <OverviewStats
        isLoading={isLoading}
        stats={overviewStats}
        onHabitPress={handleHabitPress}
      />

      <ChartSections
        complianceData={complianceData}
        isLoading={isLoading}
        strengthDistribution={strengthDistribution}
        trendData={trendData}
      />

      <InsightsSections
        rankedHabits={overviewStats?.rankedHabits || []}
        weeklyInsights={weeklyInsights}
        onHabitPress={handleHabitPress}
      />

      <ExportButton onPress={() => void handleExportPress()} />

      <ExportMenu
        visible={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExport={(format) => void handleExport(format)}
      />
    </ScrollView>
  );
}
