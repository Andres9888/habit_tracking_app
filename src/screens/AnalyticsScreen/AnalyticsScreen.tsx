/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 *
 * Free users see overview stats with blurred charts/insights as a teaser,
 * encouraging upgrade rather than blocking with an instant paywall.
 */
import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
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
        <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
          <AnalyticsHeader />
        </Animated.View>

        {hasNoHabits && (
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
            <EmptyState />
          </Animated.View>
        )}

        {/* Overview stats are always visible — free users see real data */}
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <OverviewStats
            isLoading={isLoading}
            stats={overviewStats}
            onHabitPress={handleHabitPress}
          />
        </Animated.View>

        {showTeaser ? (
          /* Free users: render charts behind a blur overlay */
          <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
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
          </Animated.View>
        ) : (
          /* Premium users: full access */
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
