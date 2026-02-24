/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem` in an `Animated.View` that applies
 * entrance opacity/translateY animations **only** to the most recently created
 * habit (identified by `justCreatedHabitId`).  All other rows render without
 * the animated wrapper to avoid unnecessary native-driver overhead.
 *
 * Exit animation: All rows use Reanimated layout animation (FadeOutRight)
 * so that deletions/archiving feel smooth rather than items vanishing.
 */

import React from 'react';
import { Animated } from 'react-native';
import Reanimated, { FadeOutRight } from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
}

const EXIT_ANIMATION = FadeOutRight.duration(200).damping(18).stiffness(150);

export function renderHabitRow(opts: RenderHabitRowOptions) {
  const {
    item,
    justCreatedHabitId,
    habitRowOpacity,
    habitRowTranslateY,
    renderItem,
    renderParams,
  } = opts;

  const isNewlyCreated = item._id === justCreatedHabitId;

  return (
    <Reanimated.View exiting={EXIT_ANIMATION}>
      <Animated.View
        style={
          isNewlyCreated
            ? {
                opacity: habitRowOpacity,
                transform: [{ translateY: habitRowTranslateY }],
              }
            : undefined
        }
      >
        {renderItem(renderParams)}
      </Animated.View>
    </Reanimated.View>
  );
}
