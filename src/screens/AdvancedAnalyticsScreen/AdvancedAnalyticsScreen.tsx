/**
 * AdvancedAnalyticsScreen - Advanced analytics dashboard screen
 * Shows GitHub-style heatmap, streak trends, day analysis, and streak intervals
 */
import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useAdvancedAnalytics } from './AdvancedAnalyticsScreen.hooks';
import { styles } from './AdvancedAnalyticsScreen.styles';
import {
  AnalyticsHeader,
  ExportButton,
  ExportMenu,
} from '../AnalyticsScreen/components';
import { GitHubHeatmap } from '../../components/GitHubHeatmap';
import { StreakTrendsChart } from '../../components/StreakTrendsChart';
import { BestWorstDayAnalysis } from '../../components/BestWorstDayAnalysis';
import { StreakIntervals } from '../../components/StreakIntervals';

function AdvancedAnalyticsScreenContent() {
  const {
    refreshing,
    showPaywall,
    showExportMenu,
    isPremiumUser,
    isLoading,
    githubHeatmapData,
    streakTrendsData,
    dayAnalysisData,
    streakIntervalsData,
    darkMode,
    onRefresh,
    handleExportPress,
    handleExport,
    handleStartTrial,
    setShowPaywall,
    setShowExportMenu,
  } = useAdvancedAnalytics();

  // Show paywall modal if not premium user
  if (!isPremiumUser && showPaywall) {
    return (
      <PremiumPaywall
        visible
        variant="analytics"
        onClose={() => setShowPaywall(false)}
        onStartTrial={handleStartTrial}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: darkMode ? colors.dark.background : colors.background }]}>
        <AnalyticsHeader />
      </View>
    );
  }

  const themeColors = darkMode ? colors.dark : colors;

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

      <Animated.View
        entering={FadeInDown.delay(340).springify().damping(18)}
      >
        <View style={styles.section}>
          <GitHubHeatmap
            data={githubHeatmapData ?? null}
            darkMode={darkMode}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).springify().damping(18)}
      >
        <View style={styles.section}>
          <StreakTrendsChart
            data={streakTrendsData ?? null}
            darkMode={darkMode}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(460).springify().damping(18)}
      >
        <View style={styles.section}>
          <BestWorstDayAnalysis
            data={dayAnalysisData ?? null}
            darkMode={darkMode}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(520).springify().damping(18)}
      >
        <View style={styles.section}>
          <StreakIntervals
            data={streakIntervalsData ?? null}
            darkMode={darkMode}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(580).springify().damping(18)}
      >
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

export default function AdvancedAnalyticsScreen() {
  return (
    <ScreenErrorBoundary screenName="AdvancedAnalytics">
      <AdvancedAnalyticsScreenContent />
    </ScreenErrorBoundary>
  );
}
