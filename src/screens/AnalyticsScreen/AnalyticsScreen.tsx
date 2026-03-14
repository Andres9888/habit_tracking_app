/**
 * AnalyticsScreen - Main analytics dashboard screen
 * Shows habit statistics, charts, and insights.
 * Non-premium users see a locked state with a paywall CTA.
 */
import React, { useMemo } from 'react';
import { Pressable, ScrollView, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
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
    handlePresentPaywall,
    setShowExportMenu,
  } = useAnalyticsScreen();

  const rankedHabits = useMemo(
    () => overviewStats?.rankedHabits || [],
    [overviewStats?.rankedHabits]
  );
  const hasNoHabits = overviewStats?.totalHabits === 0;

  if (!isPremiumUser) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ScreenHeader leftAction={null} subtitle='Premium feature' title='Analytics' />
        <View style={styles.lockedContainer}>
          <Text style={[styles.lockedEmoji]}>📊</Text>
          <Text style={[styles.lockedTitle, { color: themeColors.text.primary }]}>
            Unlock Analytics
          </Text>
          <Text style={[styles.lockedDescription, { color: themeColors.text.secondary }]}>
            Get detailed insights into your habit performance with charts, trends, and weekly reports.
          </Text>
          <Pressable
            accessibilityLabel="Upgrade to Premium"
            accessibilityRole="button"
            style={({ pressed }) => [styles.lockedCta, pressed && styles.lockedCtaPressed]}
            onPress={handlePresentPaywall}
          >
            <Text style={styles.lockedCtaText}>Upgrade to Premium</Text>
          </Pressable>
        </View>
      </View>
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
        <ScreenHeader leftAction={null} subtitle='Track your habit journey' title='Analytics' />
      </Animated.View>

      {hasNoHabits ? (
        <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
          <EmptyState />
        </Animated.View>
      ) : (
        <>
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
            <OverviewStats isLoading={isLoading} stats={overviewStats} onHabitPress={handleHabitPress} />
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
            <InsightsSections rankedHabits={rankedHabits} weeklyInsights={weeklyInsights} onHabitPress={handleHabitPress} />
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
  );
}

export default function AnalyticsScreen() {
  return (
    <ScreenErrorBoundary screenName='Analytics'>
      <AnalyticsScreenContent />
    </ScreenErrorBoundary>
  );
}
