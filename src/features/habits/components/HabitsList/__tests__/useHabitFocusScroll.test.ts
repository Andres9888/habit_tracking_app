/**
 * The Habit Library promises "Go to Today and complete X". These cover the two
 * ways that promise breaks: scrolling to the wrong place, and dropping the
 * request because the habits query had not caught up when it arrived.
 */

import { act, renderHook } from '@testing-library/react-native';
import { useHabitFocusScroll } from '../useHabitFocusScroll';
import {
  clearHabitFocus,
  requestHabitFocus,
} from '../../../hooks/habitFocusStore';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import type { Habit } from '../../../types';

const HABIT_ID = 'habit-2' as Id<'habits'>;

function makeHabits(ids: string[]) {
  return ids.map((id) => ({ _id: id, name: id })) as unknown as Habit[];
}

function setup(habits: Habit[]) {
  const scrollToIndex = jest.fn();
  const listRef = { current: { scrollToIndex } };
  const setJustCreatedHabitId = jest.fn();
  const view = renderHook(
    ({ items }: { items: Habit[] }) =>
      useHabitFocusScroll({
        habits: items,
        listRef: listRef as never,
        reduceMotion: false,
        setJustCreatedHabitId,
      }),
    { initialProps: { items: habits } }
  );
  return { scrollToIndex, setJustCreatedHabitId, view };
}

describe('useHabitFocusScroll', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearHabitFocus();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('centres the requested habit and highlights it', () => {
    const { scrollToIndex, setJustCreatedHabitId } = setup(
      makeHabits(['habit-1', 'habit-2', 'habit-3'])
    );

    act(() => requestHabitFocus(HABIT_ID));
    expect(setJustCreatedHabitId).toHaveBeenCalledWith(HABIT_ID);

    act(() => jest.runAllTimers());
    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 1,
      viewPosition: 0.5,
    });
  });

  it('waits for the habit to arrive rather than dropping the request', () => {
    const { scrollToIndex, view } = setup(makeHabits(['habit-1']));

    // The add mutation resolved before the habits query pushed the new row.
    act(() => requestHabitFocus(HABIT_ID));
    act(() => jest.runAllTimers());
    expect(scrollToIndex).not.toHaveBeenCalled();

    act(() => view.rerender({ items: makeHabits(['habit-1', 'habit-2']) }));
    act(() => jest.runAllTimers());
    expect(scrollToIndex).toHaveBeenCalledWith({
      animated: true,
      index: 1,
      viewPosition: 0.5,
    });
  });

  it('does not re-scroll on later renders once the request is served', () => {
    const { scrollToIndex, view } = setup(makeHabits(['habit-2']));

    act(() => requestHabitFocus(HABIT_ID));
    act(() => jest.runAllTimers());
    expect(scrollToIndex).toHaveBeenCalledTimes(1);

    act(() => view.rerender({ items: makeHabits(['habit-2', 'habit-3']) }));
    act(() => jest.runAllTimers());
    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });
});
