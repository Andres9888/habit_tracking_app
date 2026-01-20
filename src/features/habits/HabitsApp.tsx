import { useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { ArchiveUndoToast } from '../../components/ArchiveUndoToast';
import { RevenueCatPaywall } from '../../components/RevenueCatPaywall';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useNotificationResponse } from '../../hooks/useNotificationResponse';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openActivationModalById } = modals;
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  const notificationHandlers = useMemo(
    () => ({
      onHabitNotificationTap: (habitId: string) => {
        console.log('[HabitsApp] Opening ActivationModal for habit:', habitId);
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
      <View className='flex-1 bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100'>
        <View className='pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100' />
        <View className='pointer-events-none absolute inset-x-0 top-0 h-56 rounded-b-[40px] bg-white/95 shadow-[0px_24px_48px_rgba(120,90,50,0.06)]' />
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
              openCreateHabitScreen={handleCreateHabitRequest}
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
