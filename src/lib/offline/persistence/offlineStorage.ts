/**
 * Offline-queue storage adapter (SR-2026-04-17-03).
 *
 * The offline mutation queue holds unsynced habit data — notes,
 * identity statements, tracking entries — that may be personal. It
 * used to live in AsyncStorage in cleartext; on Android AsyncStorage
 * is unencrypted, and on iOS its contents are readable from unlocked
 * backups. Route all reads/writes through the existing secure-storage
 * abstraction so queued state is encrypted at rest via Keychain /
 * Keystore.
 *
 * One-shot migration: any values found under the legacy AsyncStorage
 * keys on first access are copied into secure storage and deleted
 * from AsyncStorage, so existing users don't lose in-flight mutations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSensitiveItem,
  removeSensitiveItem,
  setSensitiveItem,
} from '../../../utils/storage/sensitiveStorage';

const MIGRATED_KEYS = new Set<string>();

async function migrateLegacyIfNeeded(key: string): Promise<void> {
  if (MIGRATED_KEYS.has(key)) return;
  MIGRATED_KEYS.add(key);

  try {
    const legacy = await AsyncStorage.getItem(key);
    if (legacy === null) return;

    const alreadyMoved = await getSensitiveItem(key);
    if (alreadyMoved === null) {
      await setSensitiveItem(key, legacy);
    }
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (__DEV__) {
      console.warn('[offlineStorage] legacy migration failed for', key, error);
    }
  }
}

export const offlineStorage = {
  async getItem(key: string): Promise<string | null> {
    await migrateLegacyIfNeeded(key);
    return getSensitiveItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    await setSensitiveItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    await removeSensitiveItem(key);
    // Also clear any legacy AsyncStorage copy that may linger if
    // migration never ran for this key.
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore; secure removal is the source of truth
    }
  },
  async multiRemove(keys: readonly string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.removeItem(key)));
  },
};
