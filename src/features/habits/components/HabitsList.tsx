import { useCallback } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { HabitsEmptyState } from './HabitsEmptyState';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';
import { HabitsModalsState } from '../hooks/types';

interface HabitsListProps {
  list: HabitsListState;
  modals: HabitsModalsState;
}

export function HabitsList({ list, modals }: HabitsListProps) {
  const {
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
  } = list;

  const { openCreateHabitScreen } = modals;

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
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
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
