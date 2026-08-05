import { renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';

import { useCachedQuery } from '../useCachedQuery';
import { buildLatestMemoryKey } from '../../persistence/keys';
import { queryCacheStore } from '../../store/state';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../persistence/writeEntry', () => ({
  scheduleEntryWrite: jest.fn(),
}));

const query = {} as FunctionReference<'query'>;

describe('useCachedQuery serveCachedWhileSkipped', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue(undefined);
  });

  it('serves the hydrated latest slot while skipped when opted in', () => {
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: true,
    });

    const { result } = renderHook(() =>
      useCachedQuery(query, 'skip', {
        entryName: 'settings.get',
        serveCachedWhileSkipped: true,
      })
    );

    expect(result.current).toEqual({ hasPremium: true });
  });

  it('still returns undefined while skipped without the opt-in', () => {
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: true,
    });

    const { result } = renderHook(() =>
      useCachedQuery(query, 'skip', { entryName: 'settings.get' })
    );

    expect(result.current).toBeUndefined();
  });

  it('returns undefined while skipped when nothing is cached yet', () => {
    const { result } = renderHook(() =>
      useCachedQuery(query, 'skip', {
        entryName: 'settings.get',
        serveCachedWhileSkipped: true,
      })
    );

    expect(result.current).toBeUndefined();
  });
});
