import { renderHook, waitFor } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';

import { useCachedQuery } from '../useCachedQuery';
import { isTrackingLatestUsable } from '../../../../features/habits/hooks/isTrackingLatestUsable';
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildMemoryKey,
} from '../../persistence/keys';
import { scheduleEntryWrite } from '../../persistence/writeEntry';
import { queryCacheStore } from '../../store/state';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../persistence/writeEntry', () => ({
  scheduleEntryWrite: jest.fn(),
}));

const query = {} as FunctionReference<'query'>;

describe('useCachedQuery', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    jest.clearAllMocks();
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

  it('does not publish latest for subscribers that opt out of latest fallback', async () => {
    const args = { endDate: '2026-07-07', startDate: '2026-07-01' };
    const liveRows = [{ completed: true, date: '2026-07-06', habitId: 'h1' }];
    (useQuery as jest.Mock).mockReturnValue(liveRows);

    renderHook(() =>
      useCachedQuery(query, args, {
        entryName: 'habits.getTracking',
        fallbackToLatest: false,
      })
    );

    await waitFor(() => {
      expect(queryCacheStore.get(buildMemoryKey('habits.getTracking', args)))
        .toBe(liveRows);
    });
    expect(
      queryCacheStore.get(buildLatestMemoryKey('habits.getTracking'))
    ).toBeUndefined();
    expect(scheduleEntryWrite).not.toHaveBeenCalled();
  });

  it('publishes latest by default for live results', async () => {
    const args = { activeOnly: true };
    const liveRows = [{ _id: 'h1', name: 'Read' }];
    (useQuery as jest.Mock).mockReturnValue(liveRows);

    renderHook(() =>
      useCachedQuery(query, args, { entryName: 'habits.list' })
    );

    await waitFor(() => {
      expect(queryCacheStore.get(buildMemoryKey('habits.list', args))).toBe(
        liveRows
      );
    });
    expect(queryCacheStore.get(buildLatestMemoryKey('habits.list'))).toBe(
      liveRows
    );
    expect(scheduleEntryWrite).toHaveBeenCalledTimes(1);
  });

  it('allows range-sensitive consumers to explicitly publish latest', async () => {
    const args = { endDate: '2026-07-07', startDate: '2026-07-01' };
    const liveRows = [{ completed: true, date: '2026-07-06', habitId: 'h1' }];
    (useQuery as jest.Mock).mockReturnValue(liveRows);

    renderHook(() =>
      useCachedQuery(query, args, {
        entryName: 'habits.getTracking',
        fallbackToLatest: false,
        writeLatest: true,
      })
    );

    await waitFor(() => {
      expect(
        queryCacheStore.get(buildLatestMemoryKey('habits.getTracking'))
      ).toBe(liveRows);
    });
    expect(scheduleEntryWrite).toHaveBeenCalledTimes(1);
  });

  it('records the args alongside latest so readers can judge usability', async () => {
    const args = { endDate: '2026-07-06', startDate: '2026-04-07' };
    const liveRows = [{ completed: true, date: '2026-07-06', habitId: 'h1' }];
    (useQuery as jest.Mock).mockReturnValue(liveRows);

    renderHook(() =>
      useCachedQuery(query, args, { entryName: 'habits.getTracking' })
    );

    await waitFor(() => {
      expect(
        queryCacheStore.get(buildLatestArgsMemoryKey('habits.getTracking'))
      ).toBe(args);
    });
  });

  it('rejects a poisoned latest slot whose window predates the request', () => {
    // Device-confirmed regression: a stale bundle persisted a window ending
    // 90 days before today; serving it painted the visible week empty.
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), [
      { completed: true, date: '2026-04-07', habitId: 'h1' },
    ]);
    queryCacheStore.set(buildLatestArgsMemoryKey('habits.getTracking'), {
      endDate: '2026-04-06',
      startDate: '2025-07-07',
    });

    const { result } = renderHook(() =>
      useCachedQuery(
        query,
        { endDate: '2026-07-06', startDate: '2026-04-07' },
        {
          entryName: 'habits.getTracking',
          latestUsable: isTrackingLatestUsable,
        }
      )
    );

    expect(result.current).toBeUndefined();
  });

  it('serves the latest slot when its window overlaps the request', () => {
    const rows = [{ completed: true, date: '2026-07-05', habitId: 'h1' }];
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), rows);
    queryCacheStore.set(buildLatestArgsMemoryKey('habits.getTracking'), {
      endDate: '2026-07-05',
      startDate: '2026-04-06',
    });

    const { result } = renderHook(() =>
      useCachedQuery(
        query,
        { endDate: '2026-07-06', startDate: '2026-04-07' },
        {
          entryName: 'habits.getTracking',
          latestUsable: isTrackingLatestUsable,
        }
      )
    );

    expect(result.current).toBe(rows);
  });

  it('rejects the latest fallback when its args are unknown and a guard is set', () => {
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), ['rows']);

    const { result } = renderHook(() =>
      useCachedQuery(
        query,
        { endDate: '2026-07-06', startDate: '2026-04-07' },
        {
          entryName: 'habits.getTracking',
          latestUsable: isTrackingLatestUsable,
        }
      )
    );

    expect(result.current).toBeUndefined();
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
