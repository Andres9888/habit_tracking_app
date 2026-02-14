/**
 * renderHabitRow - Individual habit row renderer for HabitsList
 *
 * Uses react-native-reanimated for spring-physics entrance animations.
 */

import React from 'react';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import type { Habit } from '../../types';

interface RenderHabitRowOptions {
  item: Habit;
  justCreatedHabitId: string | null;
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
}

/**
 * Animated wrapper for newly created habit rows.
 * Uses reanimated shared values for spring-driven entrance.
 */
function AnimatedHabitRow({
  habitRowOpacity,
  habitRowTranslateY,
  renderItem,
  renderParams,
}: {
  habitRowOpacity: SharedValue<number>;
  habitRowTranslateY: SharedValue<number>;
  renderItem: (p: RenderItemParams<Habit>) => React.ReactNode;
  renderParams: RenderItemParams<Habit>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: habitRowOpacity.value,
    transform: [{ translateY: habitRowTranslateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {renderItem(renderParams)}
    </Animated.View>
  );
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

  if (item._id === justCreatedHabitId) {
    return (
      <AnimatedHabitRow
        habitRowOpacity={habitRowOpacity}
        habitRowTranslateY={habitRowTranslateY}
        renderItem={renderItem}
        renderParams={renderParams}
      />
    );
  }

  return <>{renderItem(renderParams)}</>;
}
