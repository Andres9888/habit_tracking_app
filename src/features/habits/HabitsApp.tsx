/**
 * @file HabitsApp.tsx
 * @description Main habits screen — the primary view users see after sign-in.
 *
 * ## Architecture
 * This component is a **thin orchestrator** that wires together:
 * - `useHabitsApp()` — list state (habits, week dates, loading, premium status) + modal state.
 * - `useHabitsAppHandlers()` — premium/paywall logic, create-habit gating.
 * - `useHapticFeedback()` — selection & warning haptics (respects reduced-motion).
 *
 * All heavy logic lives in hooks; this file only composes the render tree.
 *
 * ## Render Tree
 * ```
 * GestureHandlerRootView          ← required for swipe gestures in HabitsList
 *   └─ View (background)
 *       ├─ SyncStatusOverlays     ← offline / syncing banners
 *       ├─ HabitsPageSkeleton     ← shown while habits are loading (first load only)
 *       │   OR
 *       ├─ HabitsList             ← main scrollable list with week navigator
 *       ├─ FloatingActionButton   ← "+" FAB (hidden when no habits exist)
 *       └─ HabitsAppOverlays      ← modals: create habit, paywall, celebrations
 * ```
 *
 * ## Refactoring Opportunities
 * - **REFACTOR**: `useHabitsApp` returns a wide `list` object; consider splitting into
 *   `useHabitsList` + `useHabitsWeek` + `useHabitsPremium` for clearer boundaries.
 * - **REFACTOR**: The `GestureHandlerRootView` here may be redundant if `AuthGate`
 *   already wraps one — verify and remove if so.
 */

import { useCallback } from 'react';
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

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /** Absolutely positioned container for the FAB in the bottom-right corner. */
  fabContainer: {
    bottom: 32,
    position: 'absolute',
    right: 24,
  },
  flex1: { flex: 1 },
});

// ── Main Content ─────────────────────────────────────────────────────

/**
 * HabitsAppContent — the core orchestrator for the habits screen.
 *
 * Composes list state, modal state, haptic feedback, and premium/paywall
 * handlers into a single render tree. Delegates each concern to dedicated
 * hooks (`useHabitsApp`, `useHabitsAppHandlers`, `useHapticFeedback`) so
 * this component remains a thin wiring layer.
 *
 * ## Key State
 * - `list.isHabitsLoading` + `list.habits.length` → controls skeleton vs. list display.
 * - `paywallVisible` / `upgradePromptVisible` → premium upsell modals.
 * - `modals.openCreateHabitScreen` → opens the create-habit modal.
 */
function HabitsAppContent() {
  const { colors } = useThemeColors();

  // ── Hooks ──────────────────────────────────────────────────────

  /** All habit list state + modal open/close functions. */
  const { list, modals } = useHabitsApp();

  /** Haptic feedback triggers (respects user's celebration & motion preferences). */
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  /**
   * Premium gating + paywall handlers.
   * `handleCreateHabitRequest` checks the habit limit before opening the modal;
   * if the user is at the free-tier cap, it shows the upgrade prompt instead.
   */
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

  // ── Handlers ───────────────────────────────────────────────────

  /**
   * FAB press handler — wraps async `handleCreateHabitRequest` in a void call.
   * Separated so the FAB component receives a sync `() => void` callback.
   */
  const onFabPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  // ── Derived State ──────────────────────────────────────────────

  /** Show skeleton only on initial load when there are no cached habits to display. */
  const showHabitsSkeleton = list.isHabitsLoading && list.habits.length === 0;

  // ── Render ─────────────────────────────────────────────────────

  return (
    // GestureHandlerRootView is required here for swipe gestures inside HabitsList.
    // AuthGate also wraps one; react-native-gesture-handler supports nesting safely.
    <GestureHandlerRootView style={styles.flex1}>
      <View style={[styles.flex1, { backgroundColor: colors.background }]}>
        {/* Sync status banners (offline indicator, sync-in-progress) */}
        <SyncStatusOverlays />

        {showHabitsSkeleton ? (
          <HabitsPageSkeleton reduceMotion={list.reduceMotionPreference} />
        ) : (
          <Animated.View entering={FadeInDown.duration(280).springify().damping(18)} style={styles.flex1}>
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

        {/* FAB — only shown when at least one habit exists (empty state has its own CTA) */}
        {list.habits.length > 0 && (
          <View style={styles.fabContainer}>
            <FloatingActionButton
              celebrationsEnabled={list.celebrationsEnabled}
              openCreateHabitScreen={onFabPress}
              reduceMotionPreference={list.reduceMotionPreference}
            />
          </View>
        )}

        {/* Overlay modals: create habit, paywall, celebration effects */}
        <HabitsAppOverlays
          list={list}
          modals={modals}
          paywallVisible={paywallVisible}
          onPaywallClose={handlePaywallClose}
          onPaywallSuccess={handlePaywallSuccess}
        />
      </View>
    </GestureHandlerRootView>
  );
}

// ── Public Export ─────────────────────────────────────────────────────

/**
 * Top-level export wrapped in an error boundary.
 * A crash in the habits screen renders a fallback UI instead of a blank screen.
 */
export function HabitsApp() {
  return (
    <ScreenErrorBoundary screenName="Habits">
      <HabitsAppContent />
    </ScreenErrorBoundary>
  );
}

export default HabitsApp;
