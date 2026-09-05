/**
 * `clearMilestone` is a dependency of the memoised `modals` object in
 * useHabitsModalsState (and of the handlers built from it), which in turn
 * feeds useHabitsApp's memo. A fresh closure per render silently defeats both
 * memos and re-renders every memo()'d modal section on every Home render.
 */

import { renderHook } from '@testing-library/react-native';

import type { Habit } from '../../types';
import { useHabitMilestones } from '../useHabitMilestones';

const habits = [
  { _id: 'habit-1', name: 'Meditate', strength: 0.4 },
  { _id: 'habit-2', name: 'Read', strength: 0.1 },
] as unknown as Habit[];

describe('useHabitMilestones', () => {
  it('keeps clearMilestone identity across an unrelated rerender', () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: Habit[] }) => useHabitMilestones(items, false),
      { initialProps: { items: habits } }
    );

    const first = result.current.clearMilestone;
    expect(typeof first).toBe('function');

    // Same array identity: nothing the hook depends on has changed.
    rerender({ items: habits });
    expect(result.current.clearMilestone).toBe(first);

    rerender({ items: habits });
    expect(result.current.clearMilestone).toBe(first);
  });

  it('survives a new-but-equivalent habits array', () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: Habit[] }) => useHabitMilestones(items, false),
      { initialProps: { items: habits } }
    );

    const first = result.current.clearMilestone;
    rerender({ items: [...habits] as Habit[] });

    expect(result.current.clearMilestone).toBe(first);
  });
});
