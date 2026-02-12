/**
 * renderHabitRow - Individual habit row renderer for HabitsList
 */

import React from 'react';
import { Animated } from 'react-native';

interface RenderHabitRowOptions {
  item: { _id?: string };
  justCreatedHabitId: string | null;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
  renderItem: (p: any) => React.ReactNode;
  renderParams: any;
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
