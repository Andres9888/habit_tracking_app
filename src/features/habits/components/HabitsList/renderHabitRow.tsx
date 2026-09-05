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
}

const EXIT_ANIMATION = FadeOutRight.duration(durations.standard)
  .damping(18)
  .stiffness(150);

/**
 * Small dedicated component so `useAnimatedStyle` is called from a proper
 * React component instance rather than the bare `renderHabitRow` helper
 * (which is invoked imperatively per row and must not call hooks itself).
 */
function NewlyCreatedRow({
  habitRowOpacity,
  habitRowTranslateY,
  children,
}: {
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  children: React.ReactNode;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: habitRowOpacity.value,
    transform: [{ translateY: habitRowTranslateY.value }],
  }));
  return <Reanimated.View style={style}>{children}</Reanimated.View>;
}

export function renderHabitRow(opts: RenderHabitRowOptions) {
  const {
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

  return (
    <Reanimated.View
      entering={enterAnimation}
      exiting={EXIT_ANIMATION}
      onLayout={handleLayout}
    >
      {isNewlyCreated ? (
        <NewlyCreatedRow
          habitRowOpacity={habitRowOpacity}
          habitRowTranslateY={habitRowTranslateY}
        >
          {renderItem(renderParams)}
        </NewlyCreatedRow>
      ) : (
        renderItem(renderParams)
      )}
    </Reanimated.View>
  );
}
