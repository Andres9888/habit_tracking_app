/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button.
 */

import { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { HabitsList } from './components/HabitsList';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useNotificationPermissionFlow } from '../../hooks/useNotificationPermissionFlow';

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

  // Smart notification permission flow — defers OS prompt until the user
  // has completed their first habit (see docs/smart-notification-permission.md)
  const {
    prePermissionVisible,
    isRequestingPermission,
    onEnableNotifications,
    onSkipNotifications,
    onHabitCompleted,
  } = useNotificationPermissionFlow();

  /**
   * Wrap list.toggleHabit to trigger the notification permission flow
   * after the user completes a habit for the first time. We check status
   * BEFORE the toggle so we know the direction of the change.
   */
  const toggleHabitWithNotifFlow = useCallback(
    async (args: Parameters<typeof list.toggleHabit>[0]) => {
      const wasDone = list.getHabitStatus(args.habitId, args.date) === 'done';
      const result = await list.toggleHabit(args);
      // Only trigger after a mark-as-done (not an un-completion)
      if (!wasDone) {
        void onHabitCompleted(args.habitId);
      }
      return result;
    },
    [list, onHabitCompleted]
  );

  /** list with the wrapped toggleHabit — shape matches HabitsListState exactly */
  const listWithNotifFlow = useMemo(
    () => ({ ...list, toggleHabit: toggleHabitWithNotifFlow }),
    [list, toggleHabitWithNotifFlow]
  );

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
          <Animated.View entering={FadeInDown.duration(280).springify().damping(18)} style={styles.flex1}>
            <HabitsList
              canNavigateForward={list.canNavigateForward}
              list={listWithNotifFlow}
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
          notifPrePermissionVisible={prePermissionVisible}
          notifIsRequestingPermission={isRequestingPermission}
          paywallVisible={paywallVisible}
          onNotifEnable={onEnableNotifications}
          onNotifSkip={onSkipNotifications}
          onPaywallClose={handlePaywallClose}
          onPaywallSuccess={handlePaywallSuccess}
        />
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
