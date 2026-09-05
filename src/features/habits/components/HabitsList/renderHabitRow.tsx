/**
 * renderHabitRow — FlatList `renderItem` wrapper for individual habit rows.
 *
 * Wraps the output of `useHabitRenderItem` in `HabitRowWrapper`, which applies
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
import { type LayoutChangeEvent } from 'react-native';
import Reanimated, {
  FadeInDown,
  FadeOutRight,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';
import { durations, enterEasing } from '@/theme/animations';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  onHabitRowLayout?: (habitId: string, height: number) => void;
  initialEntranceDoneRef: MutableRefObject<boolean>;
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
  /** Defaults to true; false while the list is about to remount for focus. */
  exitAnimationEnabled?: boolean;
}

const EXIT_ANIMATION = FadeOutRight.duration(durations.standard)
  .damping(18)
  .stiffness(150);

/**
 * Always-mounted row wrapper, for two reasons: it keeps the tree shape stable
 * (removing it when the newly-created highlight expires would remount the card
 * subtree), and it owns `useAnimatedStyle` so the hook runs inside a real React
 * component rather than the bare `renderHabitRow` helper, which is invoked
 * imperatively per row and must not call hooks itself.  The style branches
 * inside the worklet — it is never conditionally detached.
 */
function HabitRowWrapper({
  isNewlyCreated,
  habitRowOpacity,
  habitRowTranslateY,
  children,
}: {
  isNewlyCreated: boolean;
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  children: React.ReactNode;
}) {
  const style = useAnimatedStyle(
    () =>
      isNewlyCreated
        ? {
            opacity: habitRowOpacity.value,
            transform: [{ translateY: habitRowTranslateY.value }],
          }
        : {},
    [isNewlyCreated]
  );
  return <Reanimated.View style={style}>{children}</Reanimated.View>;
}

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
      <HabitRowWrapper
        isNewlyCreated={isNewlyCreated}
        habitRowOpacity={habitRowOpacity}
        habitRowTranslateY={habitRowTranslateY}
      >
        {content}
      </HabitRowWrapper>
    </Reanimated.View>
  );
}
