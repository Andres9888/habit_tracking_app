/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button.
 */

import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { HabitsList } from './components/HabitsList';
import { CategoryFilter } from './components/CategoryFilter';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';

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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Filter habits by selected category
  const filteredList = useMemo(() => {
    if (selectedCategoryFilter === 'all') return list;
    const filteredHabits = list.habits.filter((habit) =>
      habit.tags?.includes(selectedCategoryFilter)
    );
    return { ...list, habits: filteredHabits };
  }, [list, selectedCategoryFilter]);
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

  /** Wrapper for the FAB — delegates to `handleCreateHabitRequest` (async). */
  const onFabPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  const showHabitsSkeleton = list.isHabitsLoading && list.habits.length === 0;
  const showCategoryFilter = list.habits.length > 0;

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
            {showCategoryFilter && (
              <CategoryFilter
                selectedCategory={selectedCategoryFilter}
                onSelectCategory={setSelectedCategoryFilter}
              />
            )}
            <HabitsList
              canNavigateForward={filteredList.canNavigateForward}
              list={filteredList}
              modals={modals}
              upgradePromptVisible={upgradePromptVisible}
              weekDates={filteredList.weekDates}
              onCreateHabitRequest={handleCreateHabitRequest}
              onNextWeek={filteredList.handleNextWeek}
              onPreviousWeek={filteredList.handlePreviousWeek}
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
