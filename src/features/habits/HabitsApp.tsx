/* eslint-disable max-lines */
/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and bottom action bar.
 */

import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { HabitsList } from './components/HabitsList';
import { BottomActionBar } from './components/BottomActionBar';
import { SelectionActionBar } from './components/SelectionActionBar';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import {
  useSelectionMode,
  useSelectionActions,
} from './hooks/useSelectionMode';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useBottomBarProps } from './useBottomBarProps';
import { schedulePostLaunchAppPreload } from './postLaunchPreload';
import { useTemplatesWarmup } from './hooks/useTemplatesWarmup';

const ENTERING = FadeInDown.duration(280).springify().damping(18);
const styles = StyleSheet.create({ flex1: { flex: 1 } });

// eslint-disable-next-line max-lines-per-function
function HabitsAppContent() {
  useEffect(() => {
    return schedulePostLaunchAppPreload();
  }, []);
  useTemplatesWarmup();

  const [overlaysMounted, setOverlaysMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setOverlaysMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const { colors } = useThemeColors();
  const { list, modals } = useHabitsApp();
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  const selection = useSelectionMode(list.habits);
  const selectionActions = useSelectionActions({
    selectedIds: selection.selectedIds,
    habits: list.habits,
    exitSelectionMode: selection.exitSelectionMode,
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
    modals,
    habits: list.habits,
    getHabitStatus: list.getHabitStatus,
    reduceMotion: list.reduceMotionPreference,
    onLongPressSettings: selection.enterSelectionMode,
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
              isAllSelected={selection.isAllSelected}
              isSelectionMode={selection.isSelectionMode}
              list={list}
              modals={modals}
              onDeselectAll={selection.deselectAll}
              onSelectAll={selection.selectAll}
              onToggleSelection={selection.toggleSelection}
              selectedCount={selection.selectedCount}
              selectedIds={selection.selectedIds}
              upgradePromptVisible={handlers.upgradePromptVisible}
              weekDates={list.weekDates}
              onCreateHabitRequest={handlers.handleCreateHabitRequest}
              onJumpToToday={list.handleJumpToToday}
              onNextWeek={list.handleNextWeek}
              onPreviousWeek={list.handlePreviousWeek}
              onUpgradeConfirm={handlers.handleUpgradeConfirm}
              onUpgradeDismiss={handlers.handleUpgradeDismiss}
              onUpgradeIntent={handlers.handleUpgradeIntent}
            />
          </Animated.View>
        )}
        {list.habits.length > 0 &&
          (selection.isSelectionMode ? (
            <SelectionActionBar
              selectedCount={selection.selectedCount}
              onArchive={selectionActions.handleBatchArchive}
              onCancel={selection.exitSelectionMode}
              onDelete={selectionActions.showDeleteConfirmation}
            />
          ) : (
            <BottomActionBar {...bottomBar} />
          ))}

        {overlaysMounted && (
          <HabitsAppOverlays
            batchArchiveUndoCount={selectionActions.batchArchiveUndoCount}
            batchArchiveUndoVisible={selectionActions.batchArchiveUndoVisible}
            confirmDeleteCount={selectionActions.deleteCount}
            confirmDeleteVisible={selectionActions.confirmDeleteVisible}
            modals={modals}
            paywallVisible={handlers.paywallVisible}
            onBatchArchiveDismiss={selectionActions.dismissBatchArchiveUndo}
            onBatchArchiveUndo={selectionActions.handleBatchArchiveUndo}
            onConfirmDeleteCancel={selectionActions.hideDeleteConfirmation}
            onConfirmDeleteConfirm={selectionActions.confirmBatchDelete}
            onPaywallClose={handlers.handlePaywallClose}
            onPaywallSuccess={handlers.handlePaywallSuccess}
          />
        )}
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
