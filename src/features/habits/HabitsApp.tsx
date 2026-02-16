/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button
 */

import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';

import { HabitsList } from './components/HabitsList';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { OnboardingTooltipManager } from './components/OnboardingTooltipManager';
import { SuggestedHabitsQuickStart } from './components/SuggestedHabitsQuickStart';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { useFirstTimeUser } from '../../hooks/useFirstTimeUser';
import { trackFirstHabitCreated } from '../../lib/analytics/onboarding';

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

  const {
    showTooltips,
    showSuggestedHabits,
    dismissTooltips,
    dismissSuggestedHabits,
  } = useFirstTimeUser();

  const handleSuggestedHabitSelect = async (habitName: string) => {
    void trackFirstHabitCreated(habitName);
    dismissSuggestedHabits();
    modals.openCreateHabitScreen();
  };

  const showHabitsSkeleton = list.isHabitsLoading && list.habits.length === 0;
  const showSuggested = showSuggestedHabits && list.habits.length === 0 && !showHabitsSkeleton;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <SyncStatusOverlays />

        {showHabitsSkeleton ? (
          <HabitsPageSkeleton reduceMotion={list.reduceMotionPreference} />
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
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

        {showSuggested && (
          <SuggestedHabitsQuickStart
            onSelectHabit={handleSuggestedHabitSelect}
            onDismiss={dismissSuggestedHabits}
          />
        )}

        {list.habits.length > 0 && showTooltips && (
          <OnboardingTooltipManager
            enabled={showTooltips}
            onComplete={dismissTooltips}
          />
        )}

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

export function HabitsApp() {
  return (
    <ScreenErrorBoundary screenName="Habits">
      <HabitsAppContent />
    </ScreenErrorBoundary>
  );
}

export default HabitsApp;
