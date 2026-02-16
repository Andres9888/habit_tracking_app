/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button.
 */

import { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { HabitsList } from './components/HabitsList';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { StreakMilestoneModal } from '../../components/StreakMilestoneModal';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useStreakMilestoneUpsell } from '../../hooks/useStreakMilestoneUpsell';

const styles = StyleSheet.create({
  fabContainer: {
    bottom: 32,
    position: 'absolute',
    right: 24,
  },
  flex1: { flex: 1 },
});

/**
 * HabitsAppContent — the core orchestrator for the habits screen.
 *
 * Composes list state, modal state, haptic feedback, and premium/paywall
 * handlers into a single render tree. Delegates each concern to dedicated
 * hooks (`useHabitsApp`, `useHabitsAppHandlers`, `useHapticFeedback`) so
 * this component remains a thin wiring layer.
 */
function HabitsAppContent() {
  const { colors } = useThemeColors();
  const { list, modals } = useHabitsApp();
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  // Calculate max streak across all habits for milestone upsell
  const maxStreak = useMemo(
    () =>
      list.habits.reduce(
        (max, habit) => Math.max(max, list.getStreak(habit._id)),
        0
      ),
    [list.habits, list.getStreak]
  );

  const {
    pendingMilestone,
    dismissMilestone,
    acceptMilestone,
  } = useStreakMilestoneUpsell({
    currentStreak: maxStreak,
    isPremium: list.isPremiumUser,
  });

  const {
    handleCreateHabitRequest,
    handlePaywallClose,
    handlePaywallSuccess,
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    paywallVisible,
    upgradePromptVisible,
  } = useHabitsAppHandlers({
    hasReachedHabitLimit: list.hasReachedHabitLimit,
    isPremiumUser: list.isPremiumUser,
    openCreateHabitScreen: modals.openCreateHabitScreen,
    triggerSelection,
    triggerWarning,
  });

  /** Handle streak milestone CTA — opens paywall */
  const handleMilestoneAccept = useCallback(() => {
    const shouldOpen = acceptMilestone();
    if (shouldOpen) {
      // Small delay so milestone modal closes first
      setTimeout(() => handleUpgradeIntent(), 200);
    }
  }, [acceptMilestone, handleUpgradeIntent]);

  /** Wrapper for the FAB — delegates to `handleCreateHabitRequest` (async). */
  const onFabPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  const showHabitsSkeleton = list.isHabitsLoading && list.habits.length === 0;

  return (
    // GestureHandlerRootView is required here for swipe gestures inside HabitsList.
    // AuthGate also wraps one; react-native-gesture-handler supports nesting safely.
    <GestureHandlerRootView style={styles.flex1}>
      <View style={[styles.flex1, { backgroundColor: colors.background }]}>
        <SyncStatusOverlays />

        {showHabitsSkeleton ? (
          <HabitsPageSkeleton reduceMotion={list.reduceMotionPreference} />
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={styles.flex1}>
            <HabitsList
              canNavigateForward={list.canNavigateForward}
              list={list}
              modals={modals}
              upgradePromptVisible={upgradePromptVisible}
              weekDates={list.weekDates}
              onCreateHabitRequest={handleCreateHabitRequest}
              onNextWeek={list.handleNextWeek}
              onPreviousWeek={list.handlePreviousWeek}
              onUpgradeConfirm={handleUpgradeConfirm}
              onUpgradeDismiss={handleUpgradeDismiss}
              onUpgradeIntent={handleUpgradeIntent}
            />
          </Animated.View>
        )}

        {list.habits.length > 0 && (
          <View style={styles.fabContainer}>
            <FloatingActionButton
              celebrationsEnabled={list.celebrationsEnabled}
              openCreateHabitScreen={onFabPress}
              reduceMotionPreference={list.reduceMotionPreference}
            />
          </View>
        )}

        <HabitsAppOverlays
          list={list}
          modals={modals}
          paywallVisible={paywallVisible}
          onPaywallClose={handlePaywallClose}
          onPaywallSuccess={handlePaywallSuccess}
        />

        {/* Streak milestone celebration with premium upsell */}
        {pendingMilestone && (
          <StreakMilestoneModal
            visible={!!pendingMilestone}
            emoji={pendingMilestone.emoji}
            title={pendingMilestone.title}
            message={pendingMilestone.message}
            ctaText={pendingMilestone.ctaText}
            onAccept={handleMilestoneAccept}
            onDismiss={dismissMilestone}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

/** Top-level export wrapped in an error boundary. */
export function HabitsApp() {
  return (
    <ScreenErrorBoundary screenName="Habits">
      <HabitsAppContent />
    </ScreenErrorBoundary>
  );
}

export default HabitsApp;
