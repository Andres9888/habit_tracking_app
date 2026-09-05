/**
 * The catalog warm is a ONE-SHOT query, not a subscription: an open
 * subscription pushes the full ~215KB catalog to every client on any template
 * edit and re-persists it. These tests pin the one-shot shape.
 */
import { renderHook, waitFor } from '@testing-library/react-native';
import { useConvex } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import { hasCachedQueryValue, primeQueryCache } from '../../../lib/queryCache';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import { cancelPendingWrites } from '../../../lib/queryCache/persistence/writeEntry';
import { useWarmTemplatesCache } from '../useWarmTemplatesCache';

jest.mock('convex/react', () => ({ useConvex: jest.fn() }));

jest.mock('../../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: (task: () => void) => {
    task();
    return () => {};
  },
}));

const mockUseConvex = useConvex as jest.Mock;
const templates = [{ _id: 'template-1', name: 'Daily walk' }];

function mockClient(query: jest.Mock) {
  mockUseConvex.mockReturnValue({ query });
  return query;
}

describe('useWarmTemplatesCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cancelPendingWrites();
    queryCacheStore.reset();
  });

  it('primes the cache from a single query', async () => {
    const query = mockClient(jest.fn().mockResolvedValue(templates));

    renderHook(() => useWarmTemplatesCache());

    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(api.templates.list, {});
    await waitFor(() =>
      expect(hasCachedQueryValue('templates.list', {})).toBe(true)
    );
  });

  it('does not query when the cache already holds the catalog', () => {
    primeQueryCache('templates.list', {}, templates);
    const query = mockClient(jest.fn());

    renderHook(() => useWarmTemplatesCache());

    expect(query).not.toHaveBeenCalled();
  });

  it('swallows query failures', async () => {
    const query = mockClient(jest.fn().mockRejectedValue(new Error('offline')));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => renderHook(() => useWarmTemplatesCache())).not.toThrow();

    await waitFor(() => expect(query).toHaveBeenCalled());
    expect(hasCachedQueryValue('templates.list', {})).toBe(false);
    warn.mockRestore();
  });
});
