/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 *
 * Free users see overview stats with blurred charts/insights as a teaser,
 * encouraging upgrade rather than blocking with an instant paywall.
 */
import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
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
  PremiumBlurOverlay,
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

  if (isLoading) {
    return <AnalyticsScreenSkeleton />;
  }

  const hasNoHabits = overviewStats?.totalHabits === 0;
  const showTeaser = !isPremiumUser;

  return (
    <>
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

        {/* Overview stats are always visible — free users see real data */}
        <OverviewStats
          isLoading={isLoading}
          stats={overviewStats}
          onHabitPress={handleHabitPress}
        />

        {showTeaser ? (
          /* Free users: render charts behind a blur overlay */
          <View style={styles.teaserWrapper}>
            <View pointerEvents="none">
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
            </View>

            <PremiumBlurOverlay onUpgrade={() => setShowPaywall(true)} />
          </View>
        ) : (
          /* Premium users: full access */
          <>
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
          </>
        )}

        <ExportMenu
          visible={showExportMenu}
          onClose={() => setShowExportMenu(false)}
          onExport={(format) => void handleExport(format)}
        />
      </ScrollView>

      {/* Full paywall modal — only shown when user taps "Upgrade to Pro" */}
      {showPaywall && (
        <PremiumPaywall
          variant="analytics"
          visible
          onClose={() => setShowPaywall(false)}
          onStartTrial={handleStartTrial}
        />
      )}
    </>
  );
}
