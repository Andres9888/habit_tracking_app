/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and bottom action bar.
 */

import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { HabitsList } from './components/HabitsList';
import { BottomActionBar } from './components/BottomActionBar';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useBottomBarProps } from './useBottomBarProps';

const ENTERING = FadeInDown.duration(280).springify().damping(18);
const styles = StyleSheet.create({ flex1: { flex: 1 } });

// eslint-disable-next-line max-lines-per-function
function HabitsAppContent() {
  const { colors } = useThemeColors();
  const { list, modals } = useHabitsApp();
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  const handlers = useHabitsAppHandlers({
    hasReachedHabitLimit: list.hasReachedHabitLimit,
    isPremiumUser: list.isPremiumUser,
    openCreateHabitScreen: modals.openCreateHabitScreen,
    triggerSelection,
    triggerWarning,
  });

  const bottomBar = useBottomBarProps({
    handleCreateHabitRequest: handlers.handleCreateHabitRequest,
    list,
    modals,
  });

  const showSkeleton = list.isHabitsLoading && list.habits.length === 0;

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <View style={[styles.flex1, { backgroundColor: colors.background }]}>
        <SyncStatusOverlays />
        {showSkeleton ? (
          <HabitsPageSkeleton reduceMotion={list.reduceMotionPreference} />
        ) : (
          <Animated.View entering={ENTERING} style={styles.flex1}>
            <HabitsList
              canNavigateForward={list.canNavigateForward}
              list={list}
              modals={modals}
              upgradePromptVisible={handlers.upgradePromptVisible}
              weekDates={list.weekDates}
              onCreateHabitRequest={handlers.handleCreateHabitRequest}
              onNextWeek={list.handleNextWeek}
              onPreviousWeek={list.handlePreviousWeek}
              onUpgradeConfirm={handlers.handleUpgradeConfirm}
              onUpgradeDismiss={handlers.handleUpgradeDismiss}
              onUpgradeIntent={handlers.handleUpgradeIntent}
            />
          </Animated.View>
        )}
        {list.habits.length > 0 && <BottomActionBar {...bottomBar} />}
        <HabitsAppOverlays
          list={list}
          modals={modals}
          paywallVisible={handlers.paywallVisible}
          onPaywallClose={handlers.handlePaywallClose}
          onPaywallSuccess={handlers.handlePaywallSuccess}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export function HabitsApp() {
  return (
    <ScreenErrorBoundary screenName='Habits'>
      <HabitsAppContent />
    </ScreenErrorBoundary>
  );
}

export default HabitsApp;
