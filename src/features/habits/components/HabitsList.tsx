import { useCallback } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { HabitsEmptyState } from './HabitsEmptyState';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';

interface HabitsListProps {
  state: HabitsListState;
}

export function HabitsList({ state }: HabitsListProps) {
  const {
    habits,
    isHabitsLoading,
    weekDateStrings,
    showHabitStrengthPercentage,
    contentPadding,
    handleDragEnd,
    handleArchive,
    handleHabitPress,
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
