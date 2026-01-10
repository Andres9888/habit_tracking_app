/**
 * Draft Storage Operations - AsyncStorage-based persistence for drafts
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_MAX_AGE_MS, DRAFT_KEY_PREFIX } from './constants';
import type { DraftContentType, StoredDraft } from './types';

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

    const stored: StoredDraft = JSON.parse(raw);
    if (Date.now() - stored.timestamp > maxAgeMs) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return stored.content;
  } catch (error) {
    console.warn('Failed to read draft:', error);
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
    console.warn('Failed to save draft:', error);
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
    console.warn('Failed to clear draft:', error);
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
    console.warn('Failed to clear habit drafts:', error);
  }
}

/** Get all draft keys (for debugging/cleanup) */
export async function getAllDraftKeys(): Promise<string[]> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));
  } catch (error) {
    console.warn('Failed to get draft keys:', error);
    return [];
  }
}
