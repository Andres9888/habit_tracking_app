/* eslint-disable max-lines */
/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights
 */
import React, { useMemo } from 'react';
import { ScrollView, RefreshControl, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../theme/animations';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { AnalyticsScreenSkeleton } from '../../components/SkeletonLoader';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAnalyticsScreen } from './AnalyticsScreen.hooks';
import { styles } from './AnalyticsScreen.styles';
import {
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
    cacheSavedAt,
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
  const cacheCaption = useMemo(() => {
    if (!cacheSavedAt) return null;
    const minutes = Math.max(
      0,
      Math.floor((Date.now() - cacheSavedAt) / 60_000)
    );
    if (minutes < 1) return 'Updated just now';
    if (minutes < 60) return `Updated ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Updated ${hours}h ago`;
  }, [cacheSavedAt]);

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
      <Animated.View
        entering={FadeInDown.delay(280)
          .duration(durations.enter)
          .easing(enterEasing)}
      >
        <ScreenHeader
          leftAction={null}
          subtitle='Track your habit journey'
          title='Analytics'
        />
        {cacheCaption ? (
          <Text
            style={{
              ...typography.caption,
              color: themeColors.text.tertiary,
              marginHorizontal: 20,
              marginTop: -4,
            }}
          >
            {cacheCaption}
          </Text>
        ) : null}
      </Animated.View>

      {hasNoHabits ? (
        <Animated.View
          entering={FadeInDown.delay(340)
            .duration(durations.enter)
            .easing(enterEasing)}
        >
          <EmptyState />
        </Animated.View>
      ) : (
        <>
          <Animated.View
            entering={FadeInDown.delay(340)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <OverviewStats
              isLoading={isLoading}
              stats={overviewStats}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <ChartSections
              complianceData={complianceData}
              isLoading={isLoading}
              strengthDistribution={strengthDistribution}
              trendData={trendData}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(460)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <InsightsSections
              rankedHabits={rankedHabits}
              weeklyInsights={weeklyInsights}
              onHabitPress={handleHabitPress}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(520)
              .duration(durations.enter)
              .easing(enterEasing)}
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
