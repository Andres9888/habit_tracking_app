/* eslint-disable max-lines */
/**
 * @fileoverview AnalyticsScreen - Premium analytics dashboard
 * 
 * **What it shows:**
 * - Analytics header with title and description
 * - Overview statistics card (total habits, active/archived, completion rate)
 * - Top/bottom performing habits
 * - Charts section:
 *   - Habit strength distribution (pie chart)
 *   - 30-day trend (line chart)
 *   - Weekly compliance (bar chart)
 * - Insights section (weekly insights + ranked habits)
 * - Export button (CSV/JSON data export)
 * - Empty state when no habits exist
 * - Paywall for non-premium users
 * 
 * **How users get here:**
 * - Main tab navigation (Analytics tab)
 * - Bottom navigation bar
 * 
 * **Key interactions:**
 * - Pull-to-refresh → Reloads analytics data
 * - Tap habit in ranked list → Opens HabitDetailScreen
 * - Export button → Opens format selection modal (CSV/JSON)
 * - Premium paywall (non-premium users) → Shows trial/upgrade options
 * - All sections animate in with 60ms stagger
 * 
 * **Premium gating:**
 * - Non-premium users see paywall modal on mount
 * - "Start Trial" button in paywall
 * - Full analytics only available to premium subscribers
 * 
 * **Technical notes:**
 * - Uses custom hook: useAnalyticsScreen (data fetching, handlers)
 * - Skeleton loader shown during initial load
 * - Memoized ranked habits list
 * - RefreshControl integration
 * - Animated entrance (FadeInDown with delays: 280, 340, 400, 460, 520ms)
 */
import React, { useMemo } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

  // All React hooks must be called before any early returns
  const rankedHabits = useMemo(
    () => overviewStats?.rankedHabits || [],
    [overviewStats?.rankedHabits]
  );
  const hasNoHabits = overviewStats?.totalHabits === 0;

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
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <AnalyticsHeader />
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
