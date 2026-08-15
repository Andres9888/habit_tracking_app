import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearAccountDeletionRecovery,
  markAppDataDeletedForAccount,
  needsIdentityDeletionRecovery,
} from '../accountDeletionRecovery';

describe('account deletion recovery', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    jest.clearAllMocks();
    storage.clear();
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(storage.get(key) ?? null)
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      (key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve();
      }
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation((key: string) => {
      storage.delete(key);
      return Promise.resolve();
    });
  });

  it('only resumes deletion for the same signed-in user after app data was deleted', async () => {
    await markAppDataDeletedForAccount('user_123');

    await expect(needsIdentityDeletionRecovery('user_123')).resolves.toBe(
      true
    );
    await expect(needsIdentityDeletionRecovery('user_other')).resolves.toBe(
      false
    );
  });

  it('clears recovery state only after identity deletion succeeds', async () => {
    await markAppDataDeletedForAccount('user_123');
    await clearAccountDeletionRecovery();

    await expect(needsIdentityDeletionRecovery('user_123')).resolves.toBe(
      false
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@chainday/account-deletion-recovery-v1'
    );
  });
});
