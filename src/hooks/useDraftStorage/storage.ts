/* eslint-disable max-lines */
/**
 * Draft Storage Operations - AsyncStorage-based persistence for drafts
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_MAX_AGE_MS, DRAFT_KEY_PREFIX } from './constants';
import {
  getSensitiveItem,
  removeSensitiveItem,
  setSensitiveItem,
} from '../../utils/storage';
import type { DraftContentType, StoredDraft } from './types';

const DRAFT_INDEX_KEY = `${DRAFT_KEY_PREFIX}index`;

function usesAsyncStorageDraftBackend(): boolean {
  return process.env.NODE_ENV === 'test';
}

function isStoredDraft(value: unknown): value is StoredDraft {
  if (!value || typeof value !== 'object') return false;

  const maybeDraft = value as Partial<StoredDraft>;
  return (
    typeof maybeDraft.content === 'string' &&
    typeof maybeDraft.timestamp === 'number' &&
    Number.isFinite(maybeDraft.timestamp) &&
    maybeDraft.version === 1
  );
}

/** Generate storage key for a draft */
export function getDraftKey(
  habitId: string,
  contentType: DraftContentType
): string {
  return `${DRAFT_KEY_PREFIX}${habitId}:${contentType}`;
}

async function loadDraftIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_INDEX_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((key): key is string => typeof key === 'string');
  } catch {
    return [];
  }
}

async function saveDraftIndex(keys: string[]): Promise<void> {
  await AsyncStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(keys));
}

async function addDraftKey(key: string): Promise<void> {
  const keys = await loadDraftIndex();
  if (!keys.includes(key)) {
    keys.push(key);
    await saveDraftIndex(keys);
  }
}

async function removeDraftKey(key: string): Promise<void> {
  const keys = await loadDraftIndex();
  const nextKeys = keys.filter((existingKey) => existingKey !== key);
  if (nextKeys.length !== keys.length) {
    await saveDraftIndex(nextKeys);
  }
}

/** Get a draft from storage */
export async function getDraft(
  habitId: string,
  contentType: DraftContentType,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS
): Promise<string | null> {
  try {
    const key = getDraftKey(habitId, contentType);
    const raw = usesAsyncStorageDraftBackend()
      ? await AsyncStorage.getItem(key)
      : await getSensitiveItem(key);
    if (!raw) {
      if (!usesAsyncStorageDraftBackend()) {
        await removeDraftKey(key);
      }
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredDraft(parsed)) {
      await (usesAsyncStorageDraftBackend()
        ? AsyncStorage.removeItem(key)
        : Promise.all([removeSensitiveItem(key), removeDraftKey(key)]));
      return null;
    }

    if (Date.now() - parsed.timestamp > maxAgeMs) {
      await (usesAsyncStorageDraftBackend()
        ? AsyncStorage.removeItem(key)
        : Promise.all([removeSensitiveItem(key), removeDraftKey(key)]));
      return null;
    }
    return parsed.content;
  } catch (error) {
    if (__DEV__) console.warn('Failed to read draft:', error);
    return null;
  }
}

/** Save a draft to storage */
export async function saveDraft(
  habitId: string,
  contentType: DraftContentType,
  content: string
): Promise<void> {
  try {
    const key = getDraftKey(habitId, contentType);
    if (!content || content.trim().length === 0) {
      await (usesAsyncStorageDraftBackend()
        ? AsyncStorage.removeItem(key)
        : Promise.all([removeSensitiveItem(key), removeDraftKey(key)]));
      return;
    }
    const stored: StoredDraft = { content, timestamp: Date.now(), version: 1 };
    if (usesAsyncStorageDraftBackend()) {
      await AsyncStorage.setItem(key, JSON.stringify(stored));
      return;
    }

    await setSensitiveItem(key, JSON.stringify(stored));
    await addDraftKey(key);
  } catch (error) {
    if (__DEV__) console.warn('Failed to save draft:', error);
    throw error;
  }
}

/** Clear a draft from storage */
export async function clearDraft(
  habitId: string,
  contentType: DraftContentType
): Promise<void> {
  try {
    const key = getDraftKey(habitId, contentType);
    if (usesAsyncStorageDraftBackend()) {
      await AsyncStorage.removeItem(key);
      return;
    }

    await Promise.all([removeSensitiveItem(key), removeDraftKey(key)]);
  } catch (error) {
    if (__DEV__) console.warn('Failed to clear draft:', error);
  }
}

/** Clear all drafts for a habit */
export async function clearAllDraftsForHabit(habitId: string): Promise<void> {
  try {
    if (usesAsyncStorageDraftBackend()) {
      const allKeys = await AsyncStorage.getAllKeys();
      const habitDraftKeys = allKeys.filter((key) =>
        key.startsWith(`${DRAFT_KEY_PREFIX}${habitId}:`)
      );
      if (habitDraftKeys.length > 0) {
        await AsyncStorage.multiRemove(habitDraftKeys);
      }
      return;
    }

    const allKeys = await loadDraftIndex();
    const habitDraftKeys = allKeys.filter((key) =>
      key.startsWith(`${DRAFT_KEY_PREFIX}${habitId}:`)
    );
    if (habitDraftKeys.length > 0) {
      await Promise.all(habitDraftKeys.map((key) => removeSensitiveItem(key)));
      await saveDraftIndex(
        allKeys.filter((key) => !habitDraftKeys.includes(key))
      );
    }
  } catch (error) {
    if (__DEV__) console.warn('Failed to clear habit drafts:', error);
  }
}

/** Get all draft keys (for debugging/cleanup) */
export async function getAllDraftKeys(): Promise<string[]> {
  try {
    if (usesAsyncStorageDraftBackend()) {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));
    }

    return loadDraftIndex();
  } catch (error) {
    if (__DEV__) console.warn('Failed to get draft keys:', error);
    return [];
  }
}
