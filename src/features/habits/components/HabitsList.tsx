import { useCallback } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { HabitsEmptyState } from './HabitsEmptyState';
import { HabitsHeader } from './HabitsHeader';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';

interface HabitsListProps {
  state: HabitsListState;
  onOpenSettings: () => void;
}

export function HabitsList({ state, onOpenSettings }: HabitsListProps) {
  const {
    habits,
    isHabitsLoading,
    weekDates,
    weekDateStrings,
    canNavigateForward,
    showHabitStrengthPercentage,
    contentPadding,
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    handleNextWeek,
    handlePreviousWeek,
    handleToggleForm,
    getHabitStatus,
    getStreak,
    toggleHabit,
  } = state;

  const renderItem = useHabitRenderItem({
    weekDateStrings,
    getHabitStatus,
    getStreak,
    showHabitStrengthPercentage,
    toggleHabit,
    handleArchive,
    handleHabitPress,
  });

  const keyExtractor = useCallback(
    (habit: (typeof habits)[number]) => habit._id,
    []
  );

  return (
    <View className='flex-1'>
      <DraggableFlatList
        data={habits}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        activationDistance={12}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: contentPadding.paddingTop,
        }}
        ListHeaderComponent={
          <HabitsHeader
            canNavigateForward={canNavigateForward}
            dates={weekDates}
            onNextWeek={handleNextWeek}
            onPreviousWeek={handlePreviousWeek}
            onOpenCreateHabit={handleToggleForm}
            onOpenSettings={onOpenSettings}
            onSelectHabitById={(habitId) => {
              const habit = habits.find((h) => h._id === habitId);
              if (habit) {
                handleHabitPress(habit);
              }
            }}
          />
        }
        ListEmptyComponent={
          <HabitsEmptyState
            isLoading={isHabitsLoading}
            onCreateHabit={handleToggleForm}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default HabitsList;
