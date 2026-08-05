import { renderHook } from '@testing-library/react-native';

import { useCachedQuery } from '../hooks/useCachedQuery';
import { queryCacheStore } from '../store/state';
import { useQuery } from 'convex/react';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../persistence/writeEntry', () => ({
  scheduleEntryWrite: jest.fn(),
}));

const useQueryMock = useQuery as jest.Mock;

const FAKE_QUERY = {} as never;
const HABIT_A = { _id: 'habit_a', name: 'Meditation', currentStreak: 4 };
const HABIT_B = { _id: 'habit_b', name: 'Run 5K', currentStreak: 11 };

function renderCachedQuery(initialArgs: { habitId: string }) {
  return renderHook(
    ({ args }: { args: { habitId: string } }) =>
      useCachedQuery(FAKE_QUERY, args, { entryName: 'habits.get' }),
    { initialProps: { args: initialArgs } }
  );
}

describe('useCachedQuery across args switches (regression: stale habit flash)', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    jest.clearAllMocks();
  });

  it('never surfaces the previous args’ live payload after args change', () => {
    useQueryMock.mockReturnValue(HABIT_A);
    const { result, rerender } = renderCachedQuery({ habitId: 'habit_a' });
    expect(result.current).toEqual(HABIT_A);

    // Switch to habit B while its live query is still loading.
    useQueryMock.mockReturnValue(undefined);
    rerender({ args: { habitId: 'habit_b' } });

    // Must NOT be habit A's kept-previous payload.
    expect(result.current).not.toEqual(HABIT_A);
  });

  it('serves the new args’ own cached value instead of the previous live one', () => {
    queryCacheStore.set(
      'habits.get:{"habitId":"habit_b"}',
      HABIT_B,
      Date.now()
    );

    useQueryMock.mockReturnValue(HABIT_A);
    const { result, rerender } = renderCachedQuery({ habitId: 'habit_a' });
    expect(result.current).toEqual(HABIT_A);

    useQueryMock.mockReturnValue(undefined);
    rerender({ args: { habitId: 'habit_b' } });

    expect(result.current).toEqual(HABIT_B);
  });

  it('still bridges resubscribe flicker for the SAME args via previousLive', () => {
    useQueryMock.mockReturnValue(HABIT_A);
    const { result, rerender } = renderCachedQuery({ habitId: 'habit_a' });
    expect(result.current).toEqual(HABIT_A);

    // Same args, live transiently undefined (Convex resubscribe).
    useQueryMock.mockReturnValue(undefined);
    rerender({ args: { habitId: 'habit_a' } });

    expect(result.current).toEqual(HABIT_A);
  });
});
