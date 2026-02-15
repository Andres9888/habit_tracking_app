/**
 * Draft Storage Operations - AsyncStorage-based persistence for drafts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DraftContentType, StoredDraft } from './types';
import { DEFAULT_MAX_AGE_MS, DRAFT_KEY_PREFIX } from './constants';

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

/** Get a draft from storage */
export async function getDraft(
  habitId: string,
  contentType: DraftContentType,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS
): Promise<string | null> {
  try {
    const key = getDraftKey(habitId, contentType);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredDraft(parsed)) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    if (Date.now() - parsed.timestamp > maxAgeMs) {
      await AsyncStorage.removeItem(key);
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
      await AsyncStorage.removeItem(key);
      return;
    }
    const stored: StoredDraft = { content, timestamp: Date.now(), version: 1 };
    await AsyncStorage.setItem(key, JSON.stringify(stored));
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
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (__DEV__) console.warn('Failed to clear draft:', error);
  }
}

/** Clear all drafts for a habit */
export async function clearAllDraftsForHabit(habitId: string): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const habitDraftKeys = allKeys.filter((key) =>
      key.startsWith(`${DRAFT_KEY_PREFIX}${habitId}:`)
    );
    if (habitDraftKeys.length > 0) {
      await AsyncStorage.multiRemove(habitDraftKeys);
    }
  } catch (error) {
    if (__DEV__) console.warn('Failed to clear habit drafts:', error);
  }
}

/** Get all draft keys (for debugging/cleanup) */
export async function getAllDraftKeys(): Promise<string[]> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));
  } catch (error) {
    if (__DEV__) console.warn('Failed to get draft keys:', error);
    return [];
  }
}
