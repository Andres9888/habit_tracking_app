/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 *
 * Free users see real, useful data (overview stats + 30-day trend) with
 * premium charts/insights blurred behind an "Unlock Full Analytics" overlay.
 * This provides genuine value while encouraging upgrade.
 */
import React from 'react';
import { ScrollView, RefreshControl, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { AnalyticsScreenSkeleton } from '../../components/SkeletonLoader';
import { ErrorBoundary, ScreenErrorFallback } from '../../components/ErrorBoundary';
import { useAnalyticsScreen } from './AnalyticsScreen.hooks';
import { styles } from './AnalyticsScreen.styles';
import {
  AnalyticsHeader,
  EmptyState,
  OverviewStats,
  FreeChartSections,
  ChartSections,
  InsightsSections,
  ExportButton,
  ExportMenu,
  PremiumBlurOverlay,
} from './components';

function AnalyticsScreenContent() {
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
        <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
          <AnalyticsHeader />
        </Animated.View>

        {hasNoHabits && (
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
            <EmptyState />
          </Animated.View>
        )}

        {/* Overview stats — always visible for all users */}
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <OverviewStats
            isLoading={isLoading}
            stats={overviewStats}
            onHabitPress={handleHabitPress}
          />
        </Animated.View>

        {isPremiumUser ? (
          /* Premium: full access to everything */
          <>
            <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
              <ChartSections
                complianceData={complianceData}
                isLoading={isLoading}
                strengthDistribution={strengthDistribution}
                trendData={trendData}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
              <InsightsSections
                rankedHabits={overviewStats?.rankedHabits || []}
                weeklyInsights={weeklyInsights}
                onHabitPress={handleHabitPress}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}>
              <ExportButton onPress={() => void handleExportPress()} />
            </Animated.View>
          </>
        ) : (
          /* Free: show trend chart (useful!) then blur premium content */
          <>
            {/* Free chart: 30-Day Trend — real data, genuinely useful */}
            <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
              <FreeChartSections
                isLoading={isLoading}
                trendData={trendData}
              />
            </Animated.View>

            {/* Premium charts blurred behind overlay */}
            <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
              <View style={localStyles.teaserWrapper}>
                <View pointerEvents="none" style={localStyles.blurredContent}>
                  <ChartSections
                    complianceData={complianceData}
                    isLoading={false}
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
            </Animated.View>
          </>
        )}

        <ExportMenu
          visible={showExportMenu}
          onClose={() => setShowExportMenu(false)}
          onExport={(format) => void handleExport(format)}
        />
      </ScrollView>

      {/* Full paywall modal — only when user taps upgrade */}
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

const localStyles = StyleSheet.create({
  teaserWrapper: {
    position: 'relative',
    minHeight: 400,
    overflow: 'hidden',
  },
  blurredContent: {
    opacity: 0.4,
  },
});

export default function AnalyticsScreen() {
  return (
    <ErrorBoundary
      fallback={
        <ScreenErrorFallback
          screenName="Analytics"
          error={null}
          onRetry={() => {}}
        />
      }
    >
      <AnalyticsScreenContent />
    </ErrorBoundary>
  );
}
