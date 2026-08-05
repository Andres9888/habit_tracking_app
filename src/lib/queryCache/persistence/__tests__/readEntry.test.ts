import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CacheEntryDefinition } from '../../types';
import { readEntry } from '../readEntry';

jest.mock('@react-native-async-storage/async-storage');

const ENTRY: CacheEntryDefinition = {
  name: 'habits.getTracking',
  storage: 'plain',
  version: 1,
};

const KEY = '@test:query-cache:latest';

describe('readEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the parsed entry when version matches', async () => {
    const persisted = { args: { a: 1 }, savedAt: 5, value: ['row'], version: 1 };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(persisted)
    );

    await expect(readEntry(ENTRY, KEY)).resolves.toEqual(persisted);
  });

  it('drops entries with a mismatched version', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ args: {}, savedAt: 5, value: ['row'], version: 2 })
    );

    await expect(readEntry(ENTRY, KEY)).resolves.toBeNull();
  });

  it('drops unparseable payloads', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{not json');

    await expect(readEntry(ENTRY, KEY)).resolves.toBeNull();
  });

  it('returns null for missing keys', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await expect(readEntry(ENTRY, KEY)).resolves.toBeNull();
  });
});
