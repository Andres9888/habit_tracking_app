import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
} from '../persistence/keys';
import { cancelPendingWrites } from '../persistence/writeEntry';
import { hasCachedQueryValue, primeQueryCache } from '../prime';
import { getCacheEntry } from '../registry';
import { queryCacheStore } from '../store/state';

jest.mock('@react-native-async-storage/async-storage');

const ENTRY = getCacheEntry('templates.list');
const ARGS = {};
const VALUE = [{ _id: 'template-1', name: 'Daily walk' }];

async function flushWriteTimer(): Promise<void> {
  jest.runOnlyPendingTimers();
  await Promise.resolve();
  await Promise.resolve();
}

describe('primeQueryCache', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    cancelPendingWrites();
    queryCacheStore.reset();
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cancelPendingWrites();
    queryCacheStore.reset();
    jest.useRealTimers();
  });

  it('writes the same memory slots useCachedQuery reads', () => {
    primeQueryCache('templates.list', ARGS, VALUE);

    expect(queryCacheStore.get(buildMemoryKey('templates.list', ARGS))).toBe(
      VALUE
    );
    expect(queryCacheStore.get(buildLatestMemoryKey('templates.list'))).toBe(
      VALUE
    );
    expect(
      queryCacheStore.get(buildLatestArgsMemoryKey('templates.list'))
    ).toBe(ARGS);
  });

  it('persists the latest entry to storage', async () => {
    primeQueryCache('templates.list', ARGS, VALUE);
    await flushWriteTimer();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    const [key, json] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    expect(key).toBe(buildLatestStorageKey(ENTRY, null));
    expect(JSON.parse(json)).toMatchObject({
      args: ARGS,
      value: VALUE,
      version: ENTRY.version,
    });
  });

  it('ignores nullish values', async () => {
    primeQueryCache('templates.list', ARGS, undefined);
    primeQueryCache('templates.list', ARGS, null);
    await flushWriteTimer();

    expect(
      queryCacheStore.get(buildMemoryKey('templates.list', ARGS))
    ).toBeUndefined();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('reports whether the exact args are already cached', () => {
    expect(hasCachedQueryValue('templates.list', ARGS)).toBe(false);

    primeQueryCache('templates.list', ARGS, VALUE);

    expect(hasCachedQueryValue('templates.list', ARGS)).toBe(true);
    expect(hasCachedQueryValue('templates.list', { category: 'health' })).toBe(
      false
    );
  });
});
