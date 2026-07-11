/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem`. The most recently created habit
 * (identified by `justCreatedHabitId`) is wrapped in an `Animated.View` that can
 * carry its highlight styling; all other rows render without the animated wrapper
 * to avoid unnecessary native-driver overhead.
 *
 * Entrance: rows paint directly in their final state — there is no initial-load
 * entrance animation. (Real interactions such as completing a habit still animate
 * via their own systems.)
 *
 * Exit animation: All rows use Reanimated layout animation (FadeOutRight)
 * so that deletions/archiving feel smooth rather than items vanishing.
 */

import React, { type MutableRefObject } from 'react';
import { Animated } from 'react-native';
import Reanimated, { FadeOutRight } from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  initialEntranceDoneRef: MutableRefObject<boolean>;
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
