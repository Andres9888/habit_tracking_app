/**
 * @file AnalyticsScreen.tsx
 * @description Main analytics dashboard — shows habit statistics, charts, and insights.
 *
 * ## Architecture
 * - **Data fetching & state** is fully delegated to `useAnalyticsScreen()` hook,
 *   which provides overview stats, trend data, compliance data, strength distribution,
 *   weekly insights, and all action handlers.
 * - **Rendering** is a staggered cascade of sub-components, each entering with a
 *   60ms-incremented `FadeInDown` animation (280ms → 340ms → 400ms → 460ms → 520ms).
 * - **Premium gating**: Non-premium users see a `PremiumPaywall` modal instead of analytics.
 *
 * ## Render Flow
 * ```
 * isPremiumUser=false && showPaywall → PremiumPaywall (full-screen modal)
 * isLoading=true                     → AnalyticsScreenSkeleton
 * hasNoHabits=true                   → EmptyState
 * otherwise                          → AnalyticsHeader
 *                                       OverviewStats
 *                                       ChartSections (trends, compliance, strength)
 *                                       InsightsSections (ranked habits, weekly insights)
 *                                       ExportButton + ExportMenu
 * ```
 *
 * ## Refactoring Opportunities
 * - **REFACTOR**: The early return for `!isPremiumUser && showPaywall` breaks the hook
 *   call order rule in theory, but all hooks are called before it. Consider restructuring
 *   to render the paywall as an overlay instead of a replacement.
 * - **REFACTOR**: The stagger delay pattern (280, 340, 400, 460, 520) is manual;
 *   a `useStaggeredEntrance(count, baseDelay, increment)` helper would reduce repetition.
 */
/* eslint-disable max-lines */

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

// ── Main Content ─────────────────────────────────────────────────────

/**
 * Analytics screen content (unwrapped from error boundary).
 *
 * ## State (via `useAnalyticsScreen`)
 * - `refreshing` — pull-to-refresh indicator.
 * - `showPaywall` / `isPremiumUser` — premium gating.
 * - `showExportMenu` — controls the export format picker.
 * - `isLoading` — initial data load (shows skeleton).
 * - `overviewStats` — aggregate habit stats (total, completion rate, streaks).
 * - `strengthDistribution` — habit strength breakdown for pie/bar chart.
 * - `trendData` — daily/weekly completion trend line data.
 * - `complianceData` — compliance rate over time.
 * - `weeklyInsights` — AI-generated or computed weekly insights.
 */
function AnalyticsScreenContent() {
  const { colors: themeColors } = useThemeColors();

  // ── Hooks ──────────────────────────────────────────────────────

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

  // ── Derived State ──────────────────────────────────────────────

  /**
   * Memoized ranked habits list — avoids re-sorting on every render.
   * Falls back to empty array when overview stats haven't loaded yet.
   */
  const rankedHabits = useMemo(
    () => overviewStats?.rankedHabits || [],
    [overviewStats?.rankedHabits]
  );

  /** True when the user has no habits at all (shows empty state instead of charts). */
  const hasNoHabits = overviewStats?.totalHabits === 0;

  // ── Render: Premium Gate ───────────────────────────────────────

  // Show paywall modal if not premium user (all hooks already called above)
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

  // ── Render: Loading State ──────────────────────────────────────

  if (isLoading) {
    return <AnalyticsScreenSkeleton />;
  }

  // ── Render: Main Dashboard ─────────────────────────────────────

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
      {/* Screen header with title */}
      <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
        <AnalyticsHeader />
      </Animated.View>

      {hasNoHabits ? (
        /* Empty state — encourages user to create their first habit */
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <EmptyState />
        </Animated.View>
      ) : (
        <>
          {/* Overview cards: total habits, completion rate, best streak, etc. */}
          <Animated.View
            entering={FadeInDown.delay(340).springify().damping(18)}
          >
            <OverviewStats
              isLoading={isLoading}
              stats={overviewStats}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          {/* Charts: trend line, compliance rate, strength distribution */}
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

          {/* Insights: ranked habits table + weekly AI insights */}
          <Animated.View
            entering={FadeInDown.delay(460).springify().damping(18)}
          >
            <InsightsSections
              rankedHabits={rankedHabits}
              weeklyInsights={weeklyInsights}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          {/* Export button — opens format picker (CSV, JSON, PDF) */}
          <Animated.View
            entering={FadeInDown.delay(520).springify().damping(18)}
          >
            <ExportButton onPress={() => void handleExportPress()} />
          </Animated.View>
        </>
      )}

      {/* Export format menu (bottom sheet / action sheet) */}
      <ExportMenu
        visible={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExport={(format) => void handleExport(format)}
      />
    </ScrollView>
  );
}

// ── Public Export ─────────────────────────────────────────────────────

/**
 * Top-level export wrapped in an error boundary.
 * A crash in analytics renders a fallback UI instead of breaking the app.
 */
export default function AnalyticsScreen() {
  return (
    <ScreenErrorBoundary screenName='Analytics'>
      <AnalyticsScreenContent />
    </ScreenErrorBoundary>
  );
}
