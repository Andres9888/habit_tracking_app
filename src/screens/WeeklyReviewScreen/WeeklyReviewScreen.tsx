/**
 * WeeklyReviewScreen - Weekly habit summary and review
 * Shows completion rates, best/worst habits, streak changes, and intention setting
 */
import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { typography } from '../../theme/typography';
import { useWeeklyReview } from './WeeklyReviewScreen.hooks';
import { styles } from './WeeklyReviewScreen.styles';
import {
  WeeklyReviewHeader,
  CompletionRateCard,
  PerformanceCard,
  IntentionCard,
  ShareCard,
} from './components';

function WeeklyReviewScreenContent() {
  const { colors: themeColors } = useThemeColors();
  const {
    isLoading,
    refreshing,
    reviewData,
    intention,
    onRefresh,
    onIntentionChange,
    onSaveIntention,
    onShare,
  } = useWeeklyReview();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.contentContainer}>
          <Text style={[typography.body, { color: themeColors.text.secondary }]}>
            Loading your weekly review...
          </Text>
        </View>
      </View>
    );
  }

  if (!reviewData) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.contentContainer}>
          <Text style={[typography.heading2, { color: themeColors.text.primary }]}>
            No data available
          </Text>
          <Text style={[typography.body, { color: themeColors.text.secondary }]}>
            Start tracking habits to see your weekly review
          </Text>
        </View>
      </View>
    );
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
        <WeeklyReviewHeader
          weekNumber={reviewData.weekNumber}
          startDate={reviewData.startDate}
          endDate={reviewData.endDate}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
        <CompletionRateCard
          completionRate={reviewData.completionRate}
          totalCompletions={reviewData.totalCompletions}
          totalPossible={reviewData.totalPossibleCompletions}
          weekOverWeekChange={reviewData.weekOverWeekChange}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
        <PerformanceCard
          bestHabits={reviewData.bestHabits}
          worstHabits={reviewData.worstHabits}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
        <IntentionCard
          intention={intention}
          onIntentionChange={onIntentionChange}
          onSave={onSaveIntention}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}>
        <ShareCard
          completionRate={reviewData.completionRate}
          totalCompletions={reviewData.totalCompletions}
          weekNumber={reviewData.weekNumber}
          onShare={onShare}
        />
      </Animated.View>
    </ScrollView>
  );
}

export default function WeeklyReviewScreen() {
  return (
    <ScreenErrorBoundary screenName='WeeklyReview'>
      <WeeklyReviewScreenContent />
    </ScreenErrorBoundary>
  );
}
