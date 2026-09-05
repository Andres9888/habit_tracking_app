/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem` in an `Animated.View` that applies
 * entrance opacity/translateY animations **only** to the most recently created
 * habit (identified by `justCreatedHabitId`).  The wrapper is always rendered —
 * only its `style` is conditional — so the tree shape stays stable: dropping
 * the wrapper when the highlight expires would remount the whole card subtree
 * and reset its gesture and animation state.
 *
 * List entrance: staggered FadeInDown on the initial batch only; rows mounted
 * later by FlatList virtualization appear instantly (no entering animation).
 *
 * Exit animation: rows use a Reanimated layout animation (FadeOutRight) so
 * deletions/archiving feel smooth rather than items vanishing — except while a
 * focus request is pending, when the list remounts wholesale and every row
 * would otherwise run an exit animation nobody sees.
 */

import React, { type MutableRefObject } from 'react';
import { Animated, type LayoutChangeEvent } from 'react-native';
import Reanimated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';
import { durations, enterEasing } from '@/theme/animations';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  onHabitRowLayout?: (habitId: string, height: number) => void;
  initialEntranceDoneRef: MutableRefObject<boolean>;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
  /** Defaults to true; false while the list is about to remount for focus. */
  exitAnimationEnabled?: boolean;
}

const EXIT_ANIMATION = FadeOutRight.duration(200).damping(18).stiffness(150);

export function renderHabitRow(opts: RenderHabitRowOptions) {
  const {
    exitAnimationEnabled = true,
    item,
    justCreatedHabitId,
    onHabitRowLayout,
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
  const handleLayout = (event: LayoutChangeEvent) => {
    onHabitRowLayout?.(item._id, event.nativeEvent.layout.height);
  };

  const content = renderItem(renderParams);

  return (
    <Reanimated.View
      entering={enterAnimation}
      exiting={exitAnimationEnabled ? EXIT_ANIMATION : undefined}
      onLayout={handleLayout}
    >
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
        {content}
      </Animated.View>
    </Reanimated.View>
  );
}
