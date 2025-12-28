/**
 * useDraftStorage Hook
 * Auto-saves drafts for long-form content (Why, Letters, Reflections) to prevent data loss
 *
 * Part of Edge Case handling: T1 - Data Loss Prevention
 *
 * Features:
 * - Debounced auto-save (1000ms default delay)
 * - AsyncStorage-based persistence (cross-platform)
 * - Draft recovery on mount
 * - Automatic cleanup on successful save
 *
 * Storage Key Pattern: `draft:<habitId>:<contentType>`
 * Example: `draft:abc123:why`, `draft:abc123:letter`, `draft:abc123:reflection`
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Content types that can be auto-saved
 */
export type DraftContentType =
  | 'why'
  | 'identity'
  | 'letter-title'
  | 'letter-content'
  | 'reflection-note'
  | 'affirmation'
  | 'woop-wish'
  | 'woop-outcome'
  | 'woop-obstacle'
  | 'woop-plan'
  | 'viz-success-body'
  | 'viz-success-mind'
  | 'viz-success-emotion'
  | 'viz-failure-body'
  | 'viz-failure-mind'
  | 'viz-failure-emotion';

/**
 * Draft data structure stored in AsyncStorage
 */
interface StoredDraft {
  content: string;
  timestamp: number;
  version: 1;
}

/**
 * Configuration options for the hook
 */
export interface UseDraftStorageOptions {
  /** Unique identifier for the habit */
  habitId: string;
  /** Type of content being drafted */
  contentType: DraftContentType;
  /** Delay in ms before auto-saving (default: 1000ms) */
  debounceMs?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Maximum age of draft in ms before it's considered stale (default: 7 days) */
  maxAgeMs?: number;
  /** Callback when draft is recovered */
  onDraftRecovered?: (content: string) => void;
  /** Callback when save error occurs */
  onSaveError?: (error: Error) => void;
}

/**
 * Return value from the hook
 */
export interface UseDraftStorageReturn {
  /** Current draft value */
  draft: string;
  /** Whether there's an unsaved draft */
  hasDraft: boolean;
  /** Whether the draft was recovered from storage on mount */
  wasRecovered: boolean;
  /** Whether a save is pending (debounced) */
  isSaving: boolean;
  /** Update the draft (will auto-save after debounce) */
  setDraft: (value: string) => void;
  /** Clear the draft from storage */
  clearDraft: () => Promise<void>;
  /** Force an immediate save (bypasses debounce) */
  saveNow: () => Promise<void>;
  /** Discard the recovered draft and use empty state */
  discardRecoveredDraft: () => Promise<void>;
}

// Storage key prefix
const DRAFT_KEY_PREFIX = 'draft:';

// Default values
const DEFAULT_DEBOUNCE_MS = 1000;
const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate storage key for a draft
 */
export function getDraftKey(
  habitId: string,
  contentType: DraftContentType
): string {
  return `${DRAFT_KEY_PREFIX}${habitId}:${contentType}`;
}

/**
 * Get a draft from storage
 */
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

    // Check if draft is stale
    if (Date.now() - stored.timestamp > maxAgeMs) {
      // Draft is too old, clean it up
      await AsyncStorage.removeItem(key);
      return null;
    }

    return stored.content;
  } catch (error) {
    console.warn('Failed to read draft:', error);
    return null;
  }
}

/**
 * Save a draft to storage
 */
export async function saveDraft(
  habitId: string,
  contentType: DraftContentType,
  content: string
): Promise<void> {
  try {
    const key = getDraftKey(habitId, contentType);

    if (!content || content.trim().length === 0) {
      // If content is empty, remove the draft
      await AsyncStorage.removeItem(key);
      return;
    }

    const stored: StoredDraft = {
      content,
      timestamp: Date.now(),
      version: 1,
    };

    await AsyncStorage.setItem(key, JSON.stringify(stored));
  } catch (error) {
    console.warn('Failed to save draft:', error);
    throw error;
  }
}

/**
 * Clear a draft from storage
 */
export async function clearDraft(
  habitId: string,
  contentType: DraftContentType
): Promise<void> {
  try {
    const key = getDraftKey(habitId, contentType);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear draft:', error);
    // Don't throw - clearing is non-critical
  }
}

/**
 * Clear all drafts for a habit
 */
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

/**
 * Get all draft keys (for debugging/cleanup)
 */
export async function getAllDraftKeys(): Promise<string[]> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(DRAFT_KEY_PREFIX));
  } catch (error) {
    console.warn('Failed to get draft keys:', error);
    return [];
  }
}

/**
 * useDraftStorage Hook
 *
 * Provides auto-save functionality for form fields with debouncing,
 * persistence to AsyncStorage, and draft recovery on mount.
 *
 * @example
 * ```tsx
 * const { draft, setDraft, clearDraft, wasRecovered } = useDraftStorage({
 *   habitId: habit._id,
 *   contentType: 'why',
 *   onDraftRecovered: (content) => {
 *     // Optionally show a "Draft recovered" message
 *   },
 * });
 *
 * // When user saves successfully:
 * await handleSave();
 * await clearDraft();
 * ```
 */
export function useDraftStorage({
  habitId,
  contentType,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  enabled = true,
  maxAgeMs = DEFAULT_MAX_AGE_MS,
  onDraftRecovered,
  onSaveError,
}: UseDraftStorageOptions): UseDraftStorageReturn {
  const [draft, setDraftState] = useState<string>('');
  const [wasRecovered, setWasRecovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for debouncing
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraftRef = useRef<string | null>(null);

  // Recover draft on mount
  useEffect(() => {
    if (!enabled || !habitId) {
      setIsInitialized(true);
      return;
    }

    let isMounted = true;

    const recoverDraft = async () => {
      try {
        const recovered = await getDraft(habitId, contentType, maxAgeMs);

        if (isMounted && recovered && recovered.trim().length > 0) {
          setDraftState(recovered);
          setWasRecovered(true);
          onDraftRecovered?.(recovered);
        }
      } catch (error) {
        console.warn('Draft recovery failed:', error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    recoverDraft();

    return () => {
      isMounted = false;
    };
  }, [habitId, contentType, enabled, maxAgeMs, onDraftRecovered]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Internal save function
  const performSave = useCallback(
    async (content: string) => {
      if (!enabled || !habitId) return;

      try {
        setIsSaving(true);
        await saveDraft(habitId, contentType, content);
      } catch (error) {
        onSaveError?.(error as Error);
      } finally {
        setIsSaving(false);
        pendingDraftRef.current = null;
      }
    },
    [enabled, habitId, contentType, onSaveError]
  );

  // Debounced save
  const debouncedSave = useCallback(
    (content: string) => {
      pendingDraftRef.current = content;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSave(content);
      }, debounceMs);
    },
    [debounceMs, performSave]
  );

  // Set draft function exposed to consumers
  const setDraft = useCallback(
    (value: string) => {
      setDraftState(value);

      // Once user starts editing, it's no longer a "recovered" draft
      if (wasRecovered && value !== draft) {
        setWasRecovered(false);
      }

      if (enabled && isInitialized) {
        debouncedSave(value);
      }
    },
    [enabled, isInitialized, debouncedSave, wasRecovered, draft]
  );

  // Force immediate save
  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave(draft);
  }, [draft, performSave]);

  // Clear draft from storage
  const handleClearDraft = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await clearDraft(habitId, contentType);
    setDraftState('');
    setWasRecovered(false);
    pendingDraftRef.current = null;
  }, [habitId, contentType]);

  // Discard recovered draft
  const discardRecoveredDraft = useCallback(async () => {
    await handleClearDraft();
  }, [handleClearDraft]);

  return {
    clearDraft: handleClearDraft,
    discardRecoveredDraft,
    draft,
    hasDraft: draft.trim().length > 0,
    isSaving: isSaving || pendingDraftRef.current !== null,
    saveNow,
    setDraft,
    wasRecovered,
  };
}

export default useDraftStorage;
