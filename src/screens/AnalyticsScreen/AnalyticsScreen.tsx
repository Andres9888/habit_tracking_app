/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 */
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
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
    habitInsights,
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
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <AnalyticsHeader />
      </Animated.View>

      {hasNoHabits && (
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <EmptyState />
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
        <OverviewStats
          isLoading={isLoading}
          stats={overviewStats}
          onHabitPress={handleHabitPress}
        />
      </Animated.View>

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
          habitInsights={habitInsights}
          onHabitPress={handleHabitPress}
          isPremiumUser={isPremiumUser}
          onUnlockInsights={() => setShowPaywall(true)}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}>
        <ExportButton onPress={() => void handleExportPress()} />
      </Animated.View>

      <ExportMenu
        visible={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExport={(format) => void handleExport(format)}
      />
    </ScrollView>
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
