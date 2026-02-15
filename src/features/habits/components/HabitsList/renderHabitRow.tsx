/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem` in an `Animated.View` that applies
 * entrance opacity/translateY animations **only** to the most recently created
 * habit (identified by `justCreatedHabitId`).  All other rows render without
 * the animated wrapper to avoid unnecessary native-driver overhead.
 */

import type { RenderItemParams } from 'react-native-draggable-flatlist';
import React from 'react';
import { Animated } from 'react-native';

import type { Habit } from '../../types';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
}

export function renderHabitRow(opts: RenderHabitRowOptions) {
  const {
    item,
    justCreatedHabitId,
    habitRowOpacity,
    habitRowTranslateY,
    renderItem,
    renderParams,
  } = opts;
  return (
    <Animated.View
      style={
        item._id === justCreatedHabitId
          ? {
              opacity: habitRowOpacity,
              transform: [{ translateY: habitRowTranslateY }],
            }
          : undefined
      }
    >
      {renderItem(renderParams)}
    </Animated.View>
  );
}
