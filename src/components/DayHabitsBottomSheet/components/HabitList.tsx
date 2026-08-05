import { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../../../features/habits/types';
import { HabitDayToggleRow } from '../HabitDayToggleRow';

interface HabitListProps {
  habits: Habit[];
  dateString: string;
  togglingHabitId: string | null;
  reduceMotion: boolean;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  onToggleHabit: (habitId: Id<'habits'>) => Promise<void>;
}

const ITEM_HEIGHT = 56;
const ITEM_GAP = 8;

const ItemSeparator = () => <View style={{ height: ITEM_GAP }} />;

/**
 * Virtualized list of habits for the bottom sheet.
 * Uses FlatList instead of ScrollView+map for better scroll performance.
 */
export function HabitList({
  habits,
  dateString,
  togglingHabitId,
  reduceMotion,
  getHabitStatus,
  onToggleHabit,
}: HabitListProps) {
  const hasValidDate = dateString.trim().length > 0;

  const renderItem = useCallback(
    ({ item: habit }: { item: Habit }) => {
      const status = hasValidDate
        ? getHabitStatus(habit._id, dateString)
        : 'planned';
      const isCompleted = status === 'done';
      const isLoading = togglingHabitId === habit._id;

      return (
        <HabitDayToggleRow
          habit={habit}
          isCompleted={isCompleted}
          isLoading={isLoading}
          reduceMotion={reduceMotion}
          onToggle={() => onToggleHabit(habit._id as Id<'habits'>)}
        />
      );
    },
    [
      dateString,
      getHabitStatus,
      hasValidDate,
      onToggleHabit,
      reduceMotion,
      togglingHabitId,
    ]
  );

  const keyExtractor = useCallback((item: Habit) => item._id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: (ITEM_HEIGHT + ITEM_GAP) * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      className='px-4'
      contentContainerStyle={{ paddingBottom: 8 }}
      data={habits}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={10}
      removeClippedSubviews
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      windowSize={5}
    />
  );
}
