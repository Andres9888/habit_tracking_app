/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem` in an `Animated.View` that applies
 * entrance opacity/translateY animations **only** to the most recently created
 * habit (identified by `justCreatedHabitId`).  All other rows render without
 * the animated wrapper to avoid unnecessary native-driver overhead.
 *
 * List entrance: staggered FadeInDown on the initial batch only; rows mounted
 * later by FlatList virtualization appear instantly (no entering animation).
 *
 * Exit animation: All rows use Reanimated layout animation (FadeOutRight)
 * so that deletions/archiving feel smooth rather than items vanishing.
 */

import React, { type MutableRefObject } from 'react';
import { Animated } from 'react-native';
import Reanimated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';
import { durations, enterEasing } from '@/theme/animations';

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
    initialEntranceDoneRef,
    habitRowOpacity,
    habitRowTranslateY,
    renderItem,
    renderParams,
  } = opts;

  const isNewlyCreated = item._id === justCreatedHabitId;
  const index = renderParams.getIndex() ?? 0;
  const enterAnimation = initialEntranceDoneRef.current
    ? undefined
    : FadeInDown.duration(durations.enter)
        .easing(enterEasing)
        .delay(Math.min(index, 4) * durations.stagger);

  return (
    <Reanimated.View entering={enterAnimation} exiting={EXIT_ANIMATION}>
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
