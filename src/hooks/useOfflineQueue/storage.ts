/**
 * AsyncStorage operations for the offline queue
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUEUE_INDEX_KEY } from './constants';
import { getItemKey } from './utils';
import { isValidQueuedSubmission } from './validation';
import {
  getSensitiveItem,
  removeSensitiveItem,
  setSensitiveItem,
} from '../../utils/storage';
import type { QueuedSubmission } from './types';

/** Load the queue index from storage */
export async function loadQueueIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_INDEX_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === 'string');
  } catch (error) {
    return [];
  }
}

/** Save the queue index to storage */
export async function saveQueueIndex(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_INDEX_KEY, JSON.stringify(ids));
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to save queue index');
  }
}

/** Load a single item from storage */
export async function loadQueueItem(
  id: string
): Promise<QueuedSubmission | null> {
  try {
    const key = getItemKey(id);
    const raw = await getSensitiveItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidQueuedSubmission(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/** Save a single item to storage */
export async function saveQueueItem(item: QueuedSubmission): Promise<void> {
  try {
    const key = getItemKey(item.id);
    await setSensitiveItem(key, JSON.stringify(item));
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`Failed to save queue item ${item.id}`);
  }
}

/** Remove a single item from storage */
export async function removeQueueItem(id: string): Promise<void> {
  try {
    const key = getItemKey(id);
    await removeSensitiveItem(key);
  } catch {}
}

/** Load all items from the queue */
export async function loadAllQueueItems(): Promise<QueuedSubmission[]> {
  const ids = await loadQueueIndex();
  const loadedItems = await Promise.all(ids.map((id) => loadQueueItem(id)));
  const items = loadedItems.filter(
    (item): item is QueuedSubmission => item !== null
  );

  if (items.length !== ids.length) {
    const validIds = items.map((item) => item.id);
    await saveQueueIndex(validIds);
  }

  return items.sort((a, b) => a.queuedAt - b.queuedAt);
}
