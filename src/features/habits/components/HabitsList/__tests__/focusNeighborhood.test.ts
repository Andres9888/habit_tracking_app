import type { Habit } from '../../../types';
import {
  getFocusNeighborhoodIds,
  isFocusNeighborhoodLaidOut,
} from '../focusNeighborhood';

const habits = Array.from({ length: 5 }, (_, index) => ({
  _id: `habit-${index}`,
})) as unknown as Habit[];

describe('focusNeighborhood', () => {
  it.each([
    [0, ['habit-0', 'habit-1', 'habit-2']],
    [2, ['habit-1', 'habit-2', 'habit-3']],
    [4, ['habit-2', 'habit-3', 'habit-4']],
  ])('keeps a three-row neighborhood around index %i', (index, expected) => {
    expect(getFocusNeighborhoodIds(habits, index)).toEqual(expected);
  });

  it('requires every surrounding row to have laid out', () => {
    expect(
      isFocusNeighborhoodLaidOut(
        habits,
        2,
        new Set(['habit-1', 'habit-2'])
      )
    ).toBe(false);
    expect(
      isFocusNeighborhoodLaidOut(
        habits,
        2,
        new Set(['habit-1', 'habit-2', 'habit-3'])
      )
    ).toBe(true);
  });
});
