import { renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';

import { useCachedQuery } from '../useCachedQuery';
import { buildLatestMemoryKey, buildMemoryKey } from '../../persistence/keys';
import { queryCacheStore } from '../../store/state';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

const query = {} as FunctionReference<'query'>;

describe('useCachedQuery', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    (useQuery as jest.Mock).mockReturnValue(undefined);
  });

  it('returns undefined for skip even when cached values exist', () => {
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), ['latest']);
    queryCacheStore.set(buildMemoryKey('habits.getTracking', 'skip'), [
      'cached',
    ]);

    const { result } = renderHook(() =>
      useCachedQuery(query, 'skip', { entryName: 'habits.getTracking' })
    );

    expect(result.current).toBeUndefined();
  });

  it('can opt out of latest fallback for range-sensitive consumers', () => {
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), ['latest']);

    const { result } = renderHook(() =>
      useCachedQuery(
        query,
        { endDate: '2026-07-07', startDate: '2026-07-01' },
        { entryName: 'habits.getTracking', fallbackToLatest: false }
      )
    );

    expect(result.current).toBeUndefined();
  });

  it('uses the registry latest fallback by default', () => {
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), ['latest']);

    const { result } = renderHook(() =>
      useCachedQuery(
        query,
        { endDate: '2026-07-07', startDate: '2026-07-01' },
        { entryName: 'habits.getTracking' }
      )
    );

    expect(result.current).toEqual(['latest']);
  });

  it('does not notify subscribers for unrelated keys', () => {
    const target = jest.fn();
    const other = jest.fn();
    const unsubscribeTarget = queryCacheStore.subscribe('target', target);
    const unsubscribeOther = queryCacheStore.subscribe('other', other);

    queryCacheStore.set('target', 'value', 1000);

    expect(target).toHaveBeenCalledTimes(1);
    expect(other).not.toHaveBeenCalled();

    unsubscribeTarget();
    unsubscribeOther();
  });

  it('skips notifications when value and savedAt are unchanged', () => {
    const listener = jest.fn();
    const unsubscribe = queryCacheStore.subscribe('target', listener);

    queryCacheStore.set('target', 'value', 1000);
    queryCacheStore.set('target', 'value', 1000);

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
