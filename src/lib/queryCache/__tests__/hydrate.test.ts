import { applyQueryCacheScope, hydrateQueryCache } from '../hydrate';
import { readEntry } from '../persistence/readEntry';
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildMemoryKey,
  setQueryCacheScope,
} from '../persistence/keys';
import { queryCacheStore } from '../store/state';
import {
  isQueryCacheHydrated,
  markQueryCacheHydrated,
  resetQueryCacheHydrated,
} from '../store/hydration';

jest.mock('../persistence/readEntry', () => ({
  readEntry: jest.fn(),
}));

const TRACKING_ARGS = { endDate: '2026-07-05', startDate: '2026-04-06' };
const TRACKING_ROWS = [
  { completed: true, date: '2026-07-05', habitId: 'h1' },
];

describe('hydrateQueryCache', () => {
  beforeEach(() => {
    queryCacheStore.reset();
    resetQueryCacheHydrated();
    setQueryCacheScope(null);
    jest.clearAllMocks();
    (readEntry as jest.Mock).mockResolvedValue(null);
  });

  it('populates per-args, latest, and latest-args memory keys', async () => {
    (readEntry as jest.Mock).mockImplementation((entry) =>
      Promise.resolve(
        entry.name === 'habits.getTracking'
          ? {
              args: TRACKING_ARGS,
              savedAt: 123,
              value: TRACKING_ROWS,
              version: 1,
            }
          : null
      )
    );

    await hydrateQueryCache('user_1');

    expect(
      queryCacheStore.get(buildMemoryKey('habits.getTracking', TRACKING_ARGS))
    ).toBe(TRACKING_ROWS);
    expect(
      queryCacheStore.get(buildLatestMemoryKey('habits.getTracking'))
    ).toBe(TRACKING_ROWS);
    expect(
      queryCacheStore.get(buildLatestArgsMemoryKey('habits.getTracking'))
    ).toBe(TRACKING_ARGS);
  });

  it('does not overwrite values already in memory', async () => {
    const fresh = [{ completed: true, date: '2026-07-06', habitId: 'h1' }];
    queryCacheStore.set(buildLatestMemoryKey('habits.getTracking'), fresh);
    (readEntry as jest.Mock).mockImplementation((entry) =>
      Promise.resolve(
        entry.name === 'habits.getTracking'
          ? {
              args: TRACKING_ARGS,
              savedAt: 123,
              value: TRACKING_ROWS,
              version: 1,
            }
          : null
      )
    );

    await hydrateQueryCache('user_1');

    expect(
      queryCacheStore.get(buildLatestMemoryKey('habits.getTracking'))
    ).toBe(fresh);
    // Args slot stays in sync with the latest slot: untouched when the
    // latest value was not hydrated.
    expect(
      queryCacheStore.get(buildLatestArgsMemoryKey('habits.getTracking'))
    ).toBeUndefined();
  });

  it('hydrates nothing when no entries are persisted', async () => {
    await hydrateQueryCache('user_1');

    expect(
      queryCacheStore.get(buildLatestMemoryKey('habits.getTracking'))
    ).toBeUndefined();
  });

  it('keeps memory cache when the signed-in scope is unchanged', () => {
    setQueryCacheScope('user_1');
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: true,
    });
    markQueryCacheHydrated();

    applyQueryCacheScope('user_1');

    expect(queryCacheStore.get(buildLatestMemoryKey('settings.get'))).toEqual({
      hasPremium: true,
    });
    expect(isQueryCacheHydrated()).toBe(true);
  });

  it('resets memory cache when the signed-in user changes', () => {
    setQueryCacheScope('user_1');
    queryCacheStore.set(buildLatestMemoryKey('settings.get'), {
      hasPremium: true,
    });
    markQueryCacheHydrated();

    applyQueryCacheScope('user_2');

    expect(
      queryCacheStore.get(buildLatestMemoryKey('settings.get'))
    ).toBeUndefined();
    expect(isQueryCacheHydrated()).toBe(false);
  });
});
