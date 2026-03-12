import AsyncStorage from '@react-native-async-storage/async-storage';

import { safeGetBoolean, safeSetBoolean } from './safeStorage';

jest.mock('@react-native-async-storage/async-storage');

describe('safeStorage', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns the fallback when the storage key is invalid', async () => {
    const result = await safeGetBoolean(undefined as unknown as string, false);

    expect(result).toBe(false);
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });

  it('skips writes when the storage key is invalid', async () => {
    await safeSetBoolean(undefined as unknown as string, true);

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
