import { renderHook } from '@testing-library/react-native';
import { useHabitsListEffects } from '../useHabitsListEffects';
import type { Habit } from '../../../types';

const habit = (id: string) => ({ _id: id }) as unknown as Habit;

function buildOptions(habits: Habit[]) {
  return {
    habits,
    holdJustCreatedHighlight: false,
    initialEntranceDoneRef: { current: false },
    justCreatedHabitId: null,
    seenHabitIdsRef: { current: new Set<string>() },
    setJustCreatedHabitId: jest.fn(),
    setShouldTriggerHabitEntrance: jest.fn(),
    shouldTriggerHabitEntrance: false,
  };
}

describe('useHabitsListEffects initial entrance', () => {
  it('marks rows present at the first commit as seen so rows FlatList mounts later while scrolling appear on their first frame', () => {
    const options = buildOptions([habit('a'), habit('b'), habit('c')]);

    renderHook(() => useHabitsListEffects(options));

    expect(options.initialEntranceDoneRef.current).toBe(true);
    expect([...options.seenHabitIdsRef.current]).toEqual(['a', 'b', 'c']);
  });

  it('leaves habits added after the initial entrance unseen so a newly created habit still plays its entrance', () => {
    const initial = [habit('a'), habit('b')];
    const options = buildOptions(initial);
    const { rerender } = renderHook(
      ({ habits }) => useHabitsListEffects({ ...options, habits }),
      { initialProps: { habits: initial } }
    );

    rerender({ habits: [...initial, habit('new')] });

    expect(options.seenHabitIdsRef.current.has('new')).toBe(false);
    expect(options.initialEntranceDoneRef.current).toBe(true);
  });

  it('does nothing while the list is empty', () => {
    const options = buildOptions([]);

    renderHook(() => useHabitsListEffects(options));

    expect(options.initialEntranceDoneRef.current).toBe(false);
    expect(options.seenHabitIdsRef.current.size).toBe(0);
  });
});
