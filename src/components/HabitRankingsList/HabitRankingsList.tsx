/**
 * HabitRankingsList Component
 * Displays habits ranked by strength with medals for top 3
 */

import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { styles } from './styles';
import { getRankBadge } from './utils';
import { HabitRankingItem } from './HabitRankingItem';
import { EmptyState } from './EmptyState';
import type { HabitRankingsListProps, HabitRanking } from './types';

export default function HabitRankingsList({
  habits,
  onHabitPress,
}: HabitRankingsListProps) {
  const handleHabitPress = useCallback(
    (habitId: string) => {
      if (onHabitPress) {
        onHabitPress(habitId);
      } else {
        // TODO: navigate to habit detail
      }
    },
    [onHabitPress]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: HabitRanking; index: number }) => {
      const rank = index + 1;
      return (
        <HabitRankingItem
          item={item}
          rank={rank}
          rankBadge={getRankBadge(rank)}
          onPress={() => handleHabitPress(item.id)}
        />
      );
    },
    [handleHabitPress]
  );

  const keyExtractor = useCallback((item: HabitRanking) => item.id, []);

  // Fixed height for getItemLayout optimization
  const ITEM_HEIGHT = 72;

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      nestedScrollEnabled
      contentContainerStyle={styles.listContainer}
      data={habits}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      windowSize={5}
    />
  );
}
