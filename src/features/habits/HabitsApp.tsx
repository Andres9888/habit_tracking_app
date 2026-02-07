/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { ArchiveUndoToast } from '../../components/ArchiveUndoToast';
import { RevenueCatPaywall } from '../../components/RevenueCatPaywall';
import {
  SyncingIndicator,
  SyncedToast,
  useSyncedToast,
} from '../../components/SyncStatus';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useNotificationResponse } from '../../hooks/useNotificationResponse';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useSyncStatus } from '../../contexts/SyncStatusContext';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openActivationModalById } = modals;
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  const { status: syncStatus } = useSyncStatus();
  const { visible: syncedToastVisible, syncedCount } = useSyncedToast();

  const notificationHandlers = useMemo(
    () => ({
      onHabitNotificationTap: (habitId: string) => {
        openActivationModalById(habitId);
      },
    }),
    [openActivationModalById]
  );

  useNotificationResponse(notificationHandlers);

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
    openCreateHabitScreen,
    triggerSelection,
    triggerWarning,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#FAF8F5', flex: 1 }}>
        {/* OPTIMIZED: Unified sync status - single indicator position */}
        <View className='absolute left-0 right-0 top-24 z-50 flex-row justify-center'>
          {syncStatus.isSyncing ? (
            <SyncingIndicator
              pendingCount={syncStatus.pendingCount}
              reduceMotion={list.reduceMotionPreference}
              testID='global-syncing-indicator'
              visible={syncStatus.isSyncing}
            />
          ) : (
            <SyncedToast
              reduceMotion={list.reduceMotionPreference}
              syncedCount={syncedCount}
              testID='global-synced-toast'
              visible={syncedToastVisible}
            />
          )}
        </View>

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

        {list.habits.length > 0 && (
          <View className='absolute bottom-8 right-6'>
            <FloatingActionButton
              celebrationsEnabled={list.celebrationsEnabled}
              openCreateHabitScreen={(): void => {
                void handleCreateHabitRequest();
              }}
              reduceMotionPreference={list.reduceMotionPreference}
            />
          </View>
        )}

        <WebToaster />
        <HabitsModals state={modals} />

        {/* Archive Undo Toast */}
        <ArchiveUndoToast
          duration={5000}
          habitName={list.archiveUndoHabitName}
          visible={list.archiveUndoVisible}
          onDismiss={list.dismissArchiveUndo}
          onUndo={list.handleArchiveUndo}
        />

        {/* RevenueCat Paywall */}
        <RevenueCatPaywall
          visible={paywallVisible}
          onClose={handlePaywallClose}
          onPurchaseSuccess={handlePaywallSuccess}
          onRestoreSuccess={handlePaywallSuccess}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
