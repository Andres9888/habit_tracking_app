import { queryCacheStore } from '../state';

describe('queryCacheStore reference-preserving writes', () => {
  beforeEach(() => queryCacheStore.reset());

  it('keeps the old reference but refreshes savedAt for content-equal values', () => {
    const first = [{ id: 1, name: 'Read' }];
    const listener = jest.fn();
    queryCacheStore.set('k', first, 1000);
    const unsubscribe = queryCacheStore.subscribe('k', listener);

    const equalButNew = [{ id: 1, name: 'Read' }];
    queryCacheStore.set('k', equalButNew, 2000);

    expect(queryCacheStore.get('k')).toBe(first);
    expect(queryCacheStore.get('k')).not.toBe(equalButNew);
    expect(queryCacheStore.getSavedAt('k')).toBe(2000);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('stores a new reference when content differs', () => {
    const first = [{ id: 1 }];
    queryCacheStore.set('k', first, 1000);
    const changed = [{ id: 2 }];
    queryCacheStore.set('k', changed, 2000);
    expect(queryCacheStore.get('k')).toBe(changed);
  });

  it('does not notify for an exact duplicate (same value and savedAt)', () => {
    const value = [{ id: 1 }];
    const listener = jest.fn();
    queryCacheStore.set('k', value, 1000);
    const unsubscribe = queryCacheStore.subscribe('k', listener);
    queryCacheStore.set('k', value, 1000);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });
});
