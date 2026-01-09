/**
 * HabitsList Component - Main orchestration
 * Displays the draggable list of habits with header, footer, and modals
 */

import { useCallback, useEffect } from 'react';
import { Animated, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { HabitsEmptyStateMinimal } from '../HabitsEmptyStateMinimal';
import { useHabitRenderItem } from '../../hooks/useHabitRenderItem';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { SortBottomSheet } from '../SortBottomSheet';
import { DayHabitsBottomSheet } from '../../../../components/DayHabitsBottomSheet';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsListAnimations } from './useHabitsListAnimations';
import { HabitsListHeader } from './HabitsListHeader';
import { HabitsListFooter } from './HabitsListFooter';
import { UpgradePrompt } from './UpgradePrompt';
import { ENTRANCE_STAGGER_DELAY } from './constants';
import type { HabitsListProps } from './HabitsList.types';

export function HabitsList(props: HabitsListProps) {
  const {
    list,
    modals,
    canNavigateForward,
    onCreateHabitRequest,
    onUpgradeConfirm,
    onUpgradeDismiss,
    onUpgradeIntent,
    upgradePromptVisible,
    weekDates,
    onNextWeek,
    onPreviousWeek,
  } = props;
  const {
    celebrationsEnabled,
    dayShape,
    habits,
    habitSortMode,
    habitCompletionIcon,
    isHabitsLoading,
    hasReachedHabitLimit,
    weekDateStrings,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    contentPadding,
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    getHabitStatus,
    getStreak,
    toggleHabit,
    notifyWeekCompletion,
    reduceMotionPreference,
    isPremiumUser,
  } = list;
  const { onSettingsChange, openSettings, openTemplatesScreen } = modals;

  const state = useHabitsListState();
  const { handleSuccessTransitionComplete } = useHabitsListAnimations({
    ...state,
    setIsInSuccessCelebration: state.setIsInSuccessCelebration,
    setShouldTriggerHabitEntrance: state.setShouldTriggerHabitEntrance,
  });

  const createHabit = useMutation(api.habits.create);
  const isReorderingEnabled = habitSortMode === 'manual';
  const { triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const handleChangeHabitSortMode = useCallback(
    (value: typeof habitSortMode) => {
      void onSettingsChange({ habitSortMode: value });
    },
    [onSettingsChange]
  );

  const handleQuickCreateHabit = useCallback(
    async (habitName: string) => {
      if (!isPremiumUser && hasReachedHabitLimit) {
        onCreateHabitRequest();
        return;
      }
      try {
        const newHabitId = (await createHabit({
          name: habitName,
          notes: '',
          remindersEnabled: false,
        })) as Id<'habits'>;
        if (newHabitId) {
          state.setJustCreatedHabitId(newHabitId);
          state.setIsInSuccessCelebration(true);
        }
      } catch (error) {
        console.error('Failed to create habit:', error);
      }
    },
    [
      createHabit,
      hasReachedHabitLimit,
      isPremiumUser,
      onCreateHabitRequest,
      state,
    ]
  );

  useEffect(() => {
    if (!state.justCreatedHabitId) return;
    const t = setTimeout(() => state.setJustCreatedHabitId(null), 3000);
    return () => clearTimeout(t);
  }, [state.justCreatedHabitId]);
  useEffect(() => {
    if (
      state.shouldTriggerHabitEntrance ||
      state.isInSuccessCelebration ||
      habits.length === 0
    )
      return;
    const t = setTimeout(() => state.setShouldTriggerHabitEntrance(true), 50);
    return () => clearTimeout(t);
  }, [
    habits.length,
    state.isInSuccessCelebration,
    state.shouldTriggerHabitEntrance,
  ]);

  const renderItem = useHabitRenderItem({
    celebrationsEnabled,
    completionIcon: habitCompletionIcon,
    dayShape,
    entranceStaggerDelay: ENTRANCE_STAGGER_DELAY,
    getHabitStatus,
    getStreak,
    handleArchive,
    handleHabitPress,
    highlightHabitId: state.justCreatedHabitId,
    isReorderingEnabled,
    notifyWeekCompletion,
    onHabitEntranceComplete: state.handleHabitEntranceComplete,
    reduceMotionPreference,
    seenHabitIds: state.seenHabitIdsRef.current,
    shouldTriggerEntrance: state.shouldTriggerHabitEntrance,
    showHabitStrengthPercentage,
    toggleHabit,
    weekDateStrings,
  });

  const handleAddHabitPress = useCallback(
    () => onCreateHabitRequest(),
    [onCreateHabitRequest]
  );
  const handleDragBegin = useCallback(
    () => triggerSelection(),
    [triggerSelection]
  );
  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );

  const renderHeader = useCallback(
    () => (
      <HabitsListHeader
        calendarOpacity={state.calendarOpacity}
        calendarTranslateY={state.calendarTranslateY}
        canNavigateForward={canNavigateForward}
        getHabitStatus={getHabitStatus}
        habits={habits}
        headerOpacity={state.headerOpacity}
        headerTranslateY={state.headerTranslateY}
        justCreatedHabitId={state.justCreatedHabitId}
        openSettings={openSettings}
        openTemplatesScreen={openTemplatesScreen}
        reduceMotionPreference={reduceMotionPreference}
        showWeekCompletionBar={showWeekCompletionBar}
        weekDates={weekDates}
        weekDateStrings={weekDateStrings}
        onAddHabitPress={handleAddHabitPress}
        onDayPress={state.handleDayPress}
        onNextWeek={onNextWeek}
        onOpenSortSheet={state.handleOpenSortSheet}
        onPreviousWeek={onPreviousWeek}
      />
    ),
    [
      habits,
      weekDateStrings,
      weekDates,
      canNavigateForward,
      state,
      reduceMotionPreference,
      showWeekCompletionBar,
      getHabitStatus,
      handleAddHabitPress,
      onNextWeek,
      onPreviousWeek,
      openSettings,
      openTemplatesScreen,
    ]
  );

  const renderFooter = useCallback(
    () => (
      <HabitsListFooter
        hasReachedHabitLimit={hasReachedHabitLimit}
        isPremiumUser={isPremiumUser}
        reduceMotionPreference={reduceMotionPreference}
        onUpgradeIntent={onUpgradeIntent}
      />
    ),
    [
      isPremiumUser,
      hasReachedHabitLimit,
      reduceMotionPreference,
      onUpgradeIntent,
    ]
  );

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        activationDistance={isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        data={habits}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <HabitsEmptyStateMinimal
            isLoading={isHabitsLoading}
            openCreateHabitScreen={handleAddHabitPress}
            openTemplatesScreen={openTemplatesScreen}
            onQuickCreateHabit={handleQuickCreateHabit}
            onSuccessTransitionComplete={handleSuccessTransitionComplete}
          />
        }
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        renderItem={(p) => (
          <Animated.View
            style={
              p.item._id === state.justCreatedHabitId
                ? {
                    opacity: state.habitRowOpacity,
                    transform: [{ translateY: state.habitRowTranslateY }],
                  }
                : undefined
            }
          >
            {renderItem(p)}
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
      />
      <UpgradePrompt
        visible={upgradePromptVisible}
        onClose={onUpgradeDismiss}
        onUpgradePress={onUpgradeConfirm}
      />
      <SortBottomSheet
        reduceMotion={reduceMotionPreference}
        sortMode={habitSortMode}
        visible={state.isSortSheetOpen}
        onClose={state.handleCloseSortSheet}
        onSelectSortMode={handleChangeHabitSortMode}
      />
      <DayHabitsBottomSheet
        date={state.selectedDay}
        getHabitStatus={getHabitStatus}
        habits={habits}
        reduceMotion={reduceMotionPreference}
        toggleHabit={toggleHabit}
        visible={state.isDaySheetOpen}
        onClose={state.handleCloseDaySheet}
      />
    </View>
  );
}

export default HabitsList;
