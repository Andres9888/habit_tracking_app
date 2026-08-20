import { act, renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import type { ReactNode } from 'react';

import { ConvexAuthReadyContext } from '../../../providers/ConvexAuthReady.context';
import {
  markQueryCacheHydrated,
  resetQueryCacheHydrated,
} from '../../queryCache/store/hydration';
import { queryCacheStore } from '../../queryCache/store/state';
import { buildLatestMemoryKey } from '../../queryCache/persistence/keys';
import { useSettingsQuery } from '../useSettingsQuery';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../queryCache/persistence/writeEntry', () => ({
  scheduleEntryWrite: jest.fn(),
}));

function wrapper(isConvexReady: boolean) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ConvexAuthReadyContext.Provider
        value={{ isConvexReady, retryConvexAuth: () => {} }}
      >
        {children}
      </ConvexAuthReadyContext.Provider>
    );
  };
}

describe('useSettingsQuery', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    resetQueryCacheHydrated();
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({ hasPremium: true });
  });

  afterEach(() => {
    act(() => {
      queryCacheStore.reset();
      resetQueryCacheHydrated();
    });
  });

  it('skips settings.get until Convex auth is ready', () => {
    markQueryCacheHydrated();
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: false,
    });

    renderHook(() => useSettingsQuery(), { wrapper: wrapper(false) });

    expect(useQuery).toHaveBeenCalledWith(expect.anything(), 'skip');
  });

  it('serves cached settings while Convex auth is not ready', () => {
    markQueryCacheHydrated();
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: false,
    });

    const { result } = renderHook(() => useSettingsQuery(), {
      wrapper: wrapper(false),
    });

    expect(result.current).toEqual({ hasPremium: false });
  });

  it('queries settings.get once Clerk, Convex, and cache are ready', () => {
    markQueryCacheHydrated();

    const { result } = renderHook(() => useSettingsQuery(), {
      wrapper: wrapper(true),
    });

    expect(useQuery).toHaveBeenCalledWith(expect.anything(), {});
    expect(result.current).toEqual({ hasPremium: true });
  });

  it('keeps serving cached settings while the live query is in flight', () => {
    markQueryCacheHydrated();
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: false,
    });
    (useQuery as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useSettingsQuery(), {
      wrapper: wrapper(true),
    });

    expect(useQuery).toHaveBeenCalledWith(expect.anything(), {});
    expect(result.current).toEqual({ hasPremium: false });
  });
});
