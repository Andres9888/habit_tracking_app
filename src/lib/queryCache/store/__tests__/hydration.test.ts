import {
  isQueryCacheHydrated,
  markQueryCacheHydrated,
  subscribeQueryCacheHydrated,
} from '../hydration';

describe('query cache hydration latch', () => {
  it('notifies subscribers once when hydration completes', () => {
    const listener = jest.fn();
    const unsubscribedListener = jest.fn();
    const unsubscribe = subscribeQueryCacheHydrated(listener);
    const unsubscribeBeforeHydration =
      subscribeQueryCacheHydrated(unsubscribedListener);

    unsubscribeBeforeHydration();

    expect(isQueryCacheHydrated()).toBe(false);

    markQueryCacheHydrated();

    expect(isQueryCacheHydrated()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(unsubscribedListener).not.toHaveBeenCalled();

    markQueryCacheHydrated();

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
