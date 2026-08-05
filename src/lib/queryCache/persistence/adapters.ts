import AsyncStorage from '@react-native-async-storage/async-storage';

import { offlineStorage } from '../../offline/persistence/offlineStorage';
import type { QueryCacheStorage } from '../types';

export interface CacheStorageAdapter {
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
}

const plainAdapter: CacheStorageAdapter = AsyncStorage;
const secureAdapter: CacheStorageAdapter = offlineStorage;

export function getStorageAdapter(
  storage: QueryCacheStorage
): CacheStorageAdapter {
  return storage === 'secure' ? secureAdapter : plainAdapter;
}
