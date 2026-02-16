/* eslint-disable max-lines */
/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 */
import React, { useMemo } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { AnalyticsScreenSkeleton } from '../../components/SkeletonLoader';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
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
  const { colors: themeColors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    refreshing,
    showPaywall,
    showExportMenu,
    isPremiumUser,
    isLoading,
    overviewStats,
    strengthDistribution,
    strengthTrend,
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

  // All React hooks must be called before any early returns
  const rankedHabits = useMemo(
    () => overviewStats?.rankedHabits || [],
    [overviewStats?.rankedHabits]
  );
  const hasNoHabits = overviewStats?.totalHabits === 0;

  // Dynamic header summary — answers "How am I doing?" at a glance
  const headerSummary = useMemo(() => {
    if (!overviewStats || hasNoHabits) return undefined;
    const avg = Math.round(overviewStats.averageStrength);
    if (avg >= 80) return `You're crushing it — ${avg}% average strength 💪`;
    if (avg >= 60) return `Going strong — ${avg}% average strength`;
    if (avg >= 40) return `Building momentum — ${avg}% average strength`;
    if (avg >= 20) return `Getting started — ${avg}% average strength`;
    return `Just beginning — keep going!`;
  }, [overviewStats, hasNoHabits]);

  // Premium paywall is now shown as a modal overlay (not a full screen block)
  // so users can see a preview of their analytics behind it

  if (isLoading) {
    return <AnalyticsScreenSkeleton />;
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom + 16, 48) }]}
      refreshControl={
        <RefreshControl
          colors={[colors.primary[500]]}
          refreshing={refreshing}
          tintColor={colors.primary[500]}
          onRefresh={() => void onRefresh()}
        />
      }
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <AnalyticsHeader summaryLabel={headerSummary} />
      </Animated.View>

      {hasNoHabits ? (
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <EmptyState />
        </Animated.View>
      ) : (
        <>
          <Animated.View
            entering={FadeInDown.delay(340).springify().damping(18)}
          >
            <OverviewStats
              isLoading={isLoading}
              stats={overviewStats}
              strengthTrend={strengthTrend}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).springify().damping(18)}
          >
            <ChartSections
              complianceData={complianceData}
              isLoading={isLoading}
              strengthDistribution={strengthDistribution}
              trendData={trendData}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(460).springify().damping(18)}
          >
            <InsightsSections
              rankedHabits={rankedHabits}
              weeklyInsights={weeklyInsights}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(520).springify().damping(18)}
          >
            <ExportButton onPress={() => void handleExportPress()} />
          </Animated.View>
        </>
      )}

      <ExportMenu
        visible={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExport={(format) => void handleExport(format)}
      />

      {!isPremiumUser && showPaywall && (
        <PremiumPaywall
          visible
          variant='analytics'
          onClose={() => setShowPaywall(false)}
          onStartTrial={handleStartTrial}
        />
      )}
    </ScrollView>
  );
}

export default function AnalyticsScreen() {
  return (
    <ScreenErrorBoundary screenName='Analytics'>
      <AnalyticsScreenContent />
    </ScreenErrorBoundary>
  );
}
