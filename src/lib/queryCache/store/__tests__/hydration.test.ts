import {
  isQueryCacheHydrated,
  markQueryCacheHydrated,
  resetQueryCacheHydrated,
  subscribeQueryCacheHydrated,
} from '../hydration';

describe('query cache hydration latch', () => {
  beforeEach(() => {
    resetQueryCacheHydrated();
  });

  afterEach(() => {
    resetQueryCacheHydrated();
  });

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

  it('notifies subscribers when hydration resets and can hydrate again', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeQueryCacheHydrated(listener);

    markQueryCacheHydrated();
    resetQueryCacheHydrated();

    expect(isQueryCacheHydrated()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);

    resetQueryCacheHydrated();

    expect(listener).toHaveBeenCalledTimes(2);

    markQueryCacheHydrated();

    expect(isQueryCacheHydrated()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
  });
});
