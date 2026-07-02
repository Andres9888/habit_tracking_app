import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CacheEntryDefinition } from '../../types';
import { cancelPendingWrites, scheduleEntryWrite } from '../writeEntry';

jest.mock('@react-native-async-storage/async-storage');

const ENTRY: CacheEntryDefinition = {
  name: 'habits.getTracking',
  storage: 'plain',
  version: 1,
};

async function flushWriteTimer(): Promise<void> {
  jest.runOnlyPendingTimers();
  await Promise.resolve();
  await Promise.resolve();
}

describe('scheduleEntryWrite', () => {
  const key = '@test:query-cache:latest';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    cancelPendingWrites();
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cancelPendingWrites();
    jest.useRealTimers();
  });

  it('stamps savedAt in the write timer and dedupes by value', async () => {
    jest.setSystemTime(1000);
    scheduleEntryWrite(ENTRY, key, { range: 'week' }, { b: 2, a: 1 }, null);
    jest.setSystemTime(2000);
    await flushWriteTimer();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    const savedJson = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(savedJson)).toMatchObject({
      args: { range: 'week' },
      savedAt: 2150,
      value: { b: 2, a: 1 },
      version: 1,
    });

    scheduleEntryWrite(ENTRY, key, { range: 'week' }, { a: 1, b: 2 }, null);
    await flushWriteTimer();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('retries identical values after a failed write', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (AsyncStorage.setItem as jest.Mock)
      .mockRejectedValueOnce(new Error('write failed'))
      .mockResolvedValueOnce(undefined);

    scheduleEntryWrite(ENTRY, key, {}, ['habit-1'], null);
    await flushWriteTimer();
    scheduleEntryWrite(ENTRY, key, {}, ['habit-1'], null);
    await flushWriteTimer();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});
