import { useCallback } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { HabitsEmptyState } from './HabitsEmptyState';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';
import { HabitsModalsState } from '../hooks/types';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { HabitsHeader } from './HabitsHeader';
import { CalendarTimeline } from '../../../components/CalendarTimeline';

interface HabitsListProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  canNavigateForward: boolean;
  weekDates: string[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
}

export function HabitsList({
  list,
  modals,
  canNavigateForward,
  weekDates,
  onNextWeek,
  onPreviousWeek,
}: HabitsListProps) {
  const {
    celebrationsEnabled,
    habits,
    isHabitsLoading,
    weekDateStrings,
    showHabitStrengthPercentage,
    contentPadding,
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    getHabitStatus,
    getStreak,
    toggleHabit,
    notifyWeekCompletion,
    reduceMotionPreference,
  } = list;

  const { openCreateHabitScreen, openSettings, openTemplatesScreen } = modals;

  const renderItem = useHabitRenderItem({
    celebrationsEnabled,
    getHabitStatus,
    getStreak,
    handleArchive,
    handleHabitPress,
    notifyWeekCompletion,
    reduceMotionPreference,
    weekDateStrings,
    showHabitStrengthPercentage,
    toggleHabit,
  });

  const { triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const handleDragBegin = useCallback(() => {
    triggerSelection();
  }, [triggerSelection]);

  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );

  const renderHeader = useCallback(
    () => (
      <View className='gap-3 px-6 pb-2.5 pt-16'>
        <HabitsHeader
          openCreateHabitScreen={openCreateHabitScreen}
          openSettings={openSettings}
          openTemplatesScreen={openTemplatesScreen}
        />

        <CalendarTimeline
          showSeparator
          canNavigateForward={canNavigateForward}
          dates={weekDates}
          onNextWeek={onNextWeek}
          onPreviousWeek={onPreviousWeek}
        />
      </View>
    ),
    [
      openCreateHabitScreen,
      openSettings,
      openTemplatesScreen,
      canNavigateForward,
      weekDates,
      onNextWeek,
      onPreviousWeek,
    ]
  );

  return (
    <View className='flex-1'>
      <DraggableFlatList
        data={habits}
        keyExtractor={keyExtractor}
        onDragBegin={handleDragBegin}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        activationDistance={12}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <HabitsEmptyState
            isLoading={isHabitsLoading}
            openCreateHabitScreen={openCreateHabitScreen}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default HabitsList;
