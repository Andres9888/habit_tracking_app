/**
 * GroupedHabitsList — renders habits organized by time-of-day groups.
 *
 * Activated when sort mode is `day_phase`. Replaces the flat DraggableFlatList
 * with collapsible sections: Morning, Afternoon, Evening, Anytime.
 *
 * Each section has a header showing group icon, label, and completion progress.
 * Sections are independently collapsible with spring animations.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { TimeGroupSectionHeader } from './TimeGroupSection';
import type { HabitTimeGroup, TimeGroup } from './TimeGroupSection';
import type { Habit } from '../../types';
import type { RenderItemParams } from 'react-native-draggable-flatlist';

interface GroupedHabitsListProps {
  groups: HabitTimeGroup[];
  renderItem: (params: RenderItemParams<Habit>) => React.ReactNode;
  ListHeaderComponent: React.ReactElement | null;
  ListFooterComponent: React.ReactElement | null;
  contentPadding: { paddingBottom: number; paddingHorizontal: number };
}

export function GroupedHabitsList({
  groups,
  renderItem,
  ListHeaderComponent,
  ListFooterComponent,
  contentPadding,
}: GroupedHabitsListProps) {
  const [collapsed, setCollapsed] = useState<Set<TimeGroup>>(new Set());

  const toggleGroup = useCallback((key: TimeGroup) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const contentStyle = useMemo(
    () => ({
      paddingBottom: contentPadding.paddingBottom,
      paddingHorizontal: contentPadding.paddingHorizontal,
    }),
    [contentPadding]
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentStyle}
    >
      {ListHeaderComponent}

      {groups.map((group) => {
        const isExpanded = !collapsed.has(group.key);
        return (
          <Animated.View
            key={group.key}
            layout={Layout.springify().damping(18)}
          >
            <TimeGroupSectionHeader
              group={group}
              isExpanded={isExpanded}
              onToggle={() => toggleGroup(group.key)}
            />
            {isExpanded && (
              <Animated.View
                entering={FadeIn.duration(280)}
                exiting={FadeOut.duration(200)}
              >
                {group.habits.map((habit, index) => (
                  <View key={habit._id}>
                    {renderItem({
                      item: habit,
                      getIndex: () => index,
                      drag: () => {},
                      isActive: false,
                    } as RenderItemParams<Habit>)}
                  </View>
                ))}
              </Animated.View>
            )}
          </Animated.View>
        );
      })}

      {ListFooterComponent}
    </ScrollView>
  );
}
