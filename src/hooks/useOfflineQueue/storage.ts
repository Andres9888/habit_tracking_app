/**
 * AsyncStorage operations for the offline queue
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUEUE_INDEX_KEY } from './constants';
import { getItemKey } from './utils';
import type { QueuedSubmission } from './types';

/** Load the queue index from storage */
export async function loadQueueIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (error) {
    console.warn('Failed to load queue index:', error);
    return [];
  }
}

/** Save the queue index to storage */
export async function saveQueueIndex(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_INDEX_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn('Failed to save queue index:', error);
    throw error;
  }
}

/** Load a single item from storage */
export async function loadQueueItem(
  id: string
): Promise<QueuedSubmission | null> {
  try {
    const key = getItemKey(id);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as QueuedSubmission;
  } catch (error) {
    console.warn(`Failed to load queue item ${id}:`, error);
    return null;
  }
}

/** Save a single item to storage */
export async function saveQueueItem(item: QueuedSubmission): Promise<void> {
  try {
    const key = getItemKey(item.id);
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn(`Failed to save queue item ${item.id}:`, error);
    throw error;
  }
}

/** Remove a single item from storage */
export async function removeQueueItem(id: string): Promise<void> {
  try {
    const key = getItemKey(id);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove queue item ${id}:`, error);
  }
}

/** Load all items from the queue */
export async function loadAllQueueItems(): Promise<QueuedSubmission[]> {
  const ids = await loadQueueIndex();
  const items: QueuedSubmission[] = [];

  for (const id of ids) {
    const item = await loadQueueItem(id);
    if (item) {
      items.push(item);
    }
  }

  return items.sort((a, b) => a.queuedAt - b.queuedAt);
}
