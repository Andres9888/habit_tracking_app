/**
 * Streak/strength sorts must not relocate a row when its metric changes
 * mid-session; membership and sort-mode changes still re-sort.
 */

import { renderHook } from '@testing-library/react-native';
import type { Habit } from '../../types';
import { mergeHeldOrder, useStableSortOrder } from '../useStableSortOrder';

function habits(ids: string[], streaks: Record<string, number> = {}) {
  return ids.map((id) => ({
    _id: id,
    currentStreak: streaks[id] ?? 0,
    name: id,
  })) as unknown as Habit[];
}

/** Mimics useHabitsSorting for streak_asc: streak, then name. */
function streakAsc(list: Habit[]) {
  return [...list].sort(
    (a, b) =>
      (a.currentStreak ?? 0) - (b.currentStreak ?? 0) ||
      a.name.localeCompare(b.name)
  );
}

describe('mergeHeldOrder', () => {
  it('keeps held rows in place, drops removed, slots newcomers by fresh rank', () => {
    expect(mergeHeldOrder(['a', 'c', 'b'], ['a', 'b', 'c'])).toEqual([
      'a',
      'c',
      'b',
    ]);
    expect(mergeHeldOrder(['a', 'c', 'b'], ['a', 'x', 'b', 'c'])).toEqual([
      'a',
      'x',
      'c',
      'b',
    ]);
    expect(mergeHeldOrder(['a', 'c', 'b'], ['b', 'c'])).toEqual(['c', 'b']);
    expect(mergeHeldOrder([], ['z', 'y'])).toEqual(['z', 'y']);
    expect(mergeHeldOrder(['a'], ['n', 'a'])).toEqual(['n', 'a']);
  });
});

describe('useStableSortOrder', () => {
  it('passes name/manual modes through untouched', () => {
    const list = habits(['b', 'a']);
    const { result } = renderHook(() => useStableSortOrder(list, 'name_asc'));
    expect(result.current).toBe(list);
  });

  it('holds the row where it was when its streak changes', () => {
    const initial = streakAsc(habits(['a', 'b', 'c']));
    const { result, rerender } = renderHook(
      ({ sorted }) => useStableSortOrder(sorted, 'streak_asc'),
      { initialProps: { sorted: initial } }
    );
    expect(result.current.map((h) => h._id)).toEqual(['a', 'b', 'c']);

    // 'a' completes: fresh sort would send it to the end.
    const after = streakAsc(habits(['a', 'b', 'c'], { a: 1 }));
    expect(after.map((h) => h._id)).toEqual(['b', 'c', 'a']);
    rerender({ sorted: after });
    expect(result.current.map((h) => h._id)).toEqual(['a', 'b', 'c']);
    expect(result.current[0]?.currentStreak).toBe(1);
  });

  it('inserts a new habit at its live rank without moving the others', () => {
    const initial = streakAsc(habits(['a', 'b', 'c'], { a: 1 }));
    const { result, rerender } = renderHook(
      ({ sorted }) => useStableSortOrder(sorted, 'streak_asc'),
      { initialProps: { sorted: initial } }
    );
    expect(result.current.map((h) => h._id)).toEqual(['b', 'c', 'a']);

    const withNew = streakAsc(habits(['a', 'b', 'c', 'bb'], { a: 1 }));
    rerender({ sorted: withNew });
    expect(result.current.map((h) => h._id)).toEqual(['b', 'bb', 'c', 'a']);
  });

  it('drops a removed habit and re-sorts fully on sort-mode change', () => {
    const initial = streakAsc(habits(['a', 'b', 'c']));
    const { result, rerender } = renderHook(
      ({ sorted, mode }) => useStableSortOrder(sorted, mode),
      { initialProps: { sorted: initial, mode: 'streak_asc' as const } }
    );
    rerender({
      sorted: streakAsc(habits(['a', 'c'], { a: 1 })),
      mode: 'streak_asc',
    });
    expect(result.current.map((h) => h._id)).toEqual(['a', 'c']);

    rerender({
      sorted: streakAsc(habits(['a', 'c'], { a: 1 })),
      mode: 'streak_desc',
    });
    expect(result.current.map((h) => h._id)).toEqual(['c', 'a']);
  });
});
