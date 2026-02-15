/* eslint-disable max-lines */
/**
 * AnalyticsScreen - Premium analytics dashboard screen
 * Shows habit statistics, charts, and insights with dark mode support
 */
import React from 'react';
import { ScrollView, RefreshControl, View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lock, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '../../theme';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { PremiumPaywall } from '../../components/PremiumPaywall';
import { AnalyticsScreenSkeleton } from '../../components/SkeletonLoader';
import {
  ErrorBoundary,
  ScreenErrorFallback,
} from '../../components/ErrorBoundary';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useAnalyticsScreen } from './AnalyticsScreen.hooks';
import {
  AnalyticsHeader,
  EmptyState,
  OverviewStats,
  ChartSections,
  InsightsSections,
  ExportButton,
  ExportMenu,
} from './components';

/**
 * Premium teaser shown to free-tier users — blurred preview with upgrade CTA
 */
function PremiumTeaser({ onUpgrade }: { onUpgrade: () => void }) {
  const { colors: tc, isDark } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify().damping(18)}
      style={[teaserStyles.container, { backgroundColor: tc.background }]}
    >
      {/* Blurred preview cards */}
      <View style={teaserStyles.previewRow}>
        {['Total Habits', 'Avg Strength', 'Best Streak'].map((label) => (
          <View
            key={label}
            style={[
              teaserStyles.previewCard,
              {
                backgroundColor: tc.card,
                borderColor: tc.cardBorder,
              },
            ]}
          >
            <Text style={[teaserStyles.previewLabel, { color: tc.text.tertiary }]}>
              {label}
            </Text>
            <View
              style={[
                teaserStyles.previewBlur,
                { backgroundColor: isDark ? '#374151' : '#E7E5E4' },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Upgrade CTA */}
      <View
        style={[
          teaserStyles.ctaCard,
          {
            backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
            borderColor: isDark ? '#059669' : '#A7F3D0',
          },
        ]}
      >
        <View style={teaserStyles.ctaIconRow}>
          <Sparkles color={isDark ? '#34D399' : '#059669'} size={20} />
          <Lock color={isDark ? '#34D399' : '#059669'} size={16} />
        </View>
        <Text
          style={[
            teaserStyles.ctaTitle,
            { color: isDark ? '#A7F3D0' : '#047857' },
          ]}
        >
          Unlock Premium Analytics
        </Text>
        <Text
          style={[
            teaserStyles.ctaDescription,
            { color: isDark ? '#6EE7B7' : '#059669' },
          ]}
        >
          Charts, trends, heatmaps, weekly insights, and data export
        </Text>
        <AnimatedPressable
          accessibilityLabel="Upgrade to Premium"
          accessibilityRole="button"
          style={[
            teaserStyles.ctaButton,
            { backgroundColor: isDark ? '#059669' : '#047857' },
          ]}
          onPress={onUpgrade}
        >
          <Text style={teaserStyles.ctaButtonText}>Start Free Trial</Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

const teaserStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  ctaButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: spacing.md,
    paddingVertical: 14,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  ctaCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  ctaDescription: {
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  ctaIconRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.sm,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  previewBlur: {
    borderRadius: 4,
    height: 24,
    marginTop: 8,
    width: '70%',
  },
  previewCard: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});

function AnalyticsScreenContent() {
  const { colors: tc } = useThemeColors();
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

  // Show paywall modal if triggered
  if (showPaywall) {
    return (
      <PremiumPaywall
        visible
        variant='analytics'
        onClose={() => setShowPaywall(false)}
        onStartTrial={handleStartTrial}
      />
    );
  }

  // Free tier: show teaser instead of full analytics
  if (!isPremiumUser) {
    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
        style={{ flex: 1, backgroundColor: tc.background }}
      >
        <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
          <AnalyticsHeader />
        </Animated.View>
        <PremiumTeaser onUpgrade={() => setShowPaywall(true)} />
      </ScrollView>
    );
  }

  if (isLoading) {
    return <AnalyticsScreenSkeleton />;
  }

  const hasNoHabits = overviewStats?.totalHabits === 0;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
      refreshControl={
        <RefreshControl
          colors={[colors.primary[500]]}
          refreshing={refreshing}
          tintColor={colors.primary[500]}
          onRefresh={() => void onRefresh()}
        />
      }
      style={{ flex: 1, backgroundColor: tc.background }}
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
  );
}

export default function AnalyticsScreen() {
  return (
    <ErrorBoundary
      fallback={
        <ScreenErrorFallback
          screenName='Analytics'
          error={null}
          onRetry={() => {}}
        />
      }
    >
      <AnalyticsScreenContent />
    </ErrorBoundary>
  );
}
