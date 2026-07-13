import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSensitiveItem,
  setSensitiveItem,
} from '../../../utils/storage/sensitiveStorage';
import { offlineStorage } from './offlineStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../../utils/storage/sensitiveStorage', () => ({
  getSensitiveItem: jest.fn(),
  removeSensitiveItem: jest.fn(),
  setSensitiveItem: jest.fn(),
}));

const getLegacyItem = AsyncStorage.getItem as jest.MockedFunction<
  typeof AsyncStorage.getItem
>;
const getSecureItem = getSensitiveItem as jest.MockedFunction<
  typeof getSensitiveItem
>;
const setSecureItem = setSensitiveItem as jest.MockedFunction<
  typeof setSensitiveItem
>;

describe('offline storage migration', () => {
  it('retries legacy migration after a transient failure', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    getLegacyItem
      .mockRejectedValueOnce(new Error('temporary storage failure'))
      .mockResolvedValueOnce('legacy queue');
    getSecureItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('legacy queue');
    setSecureItem.mockResolvedValue(undefined);

    await expect(offlineStorage.getItem('retry-key')).resolves.toBeNull();
    await expect(offlineStorage.getItem('retry-key')).resolves.toBe(
      'legacy queue'
    );

    expect(getLegacyItem).toHaveBeenCalledTimes(2);
    expect(setSecureItem).toHaveBeenCalledWith('retry-key', 'legacy queue');
    warn.mockRestore();
  });
});
