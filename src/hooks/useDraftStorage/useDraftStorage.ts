/**
 * useDraftStorage Hook - Auto-saves drafts for long-form content
 */
import { useCallback, useEffect, useRef } from 'react';

import { DEFAULT_DEBOUNCE_MS, DEFAULT_MAX_AGE_MS } from './constants';
import { clearDraft, saveDraft } from './storage';
import type { UseDraftStorageOptions, UseDraftStorageReturn } from './types';
import { useDraftRecovery } from './useDraftRecovery';

export function useDraftStorage({
  habitId,
  contentType,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  enabled = true,
  maxAgeMs = DEFAULT_MAX_AGE_MS,
  onDraftRecovered,
  onSaveError,
}: UseDraftStorageOptions): UseDraftStorageReturn {
  const {
    recoveredDraft: draft,
    wasRecovered,
    isInitialized,
    setRecoveredDraft: setDraftState,
    setWasRecovered,
  } = useDraftRecovery({
    contentType,
    enabled,
    habitId,
    maxAgeMs,
    onDraftRecovered,
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraftRef = useRef<string | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

  const performSave = useCallback(
    async (content: string) => {
      if (!enabled || !habitId) return;
      try {
        await saveDraft(habitId, contentType, content);
      } catch (error) {
        onSaveError?.(error as Error);
      } finally {
        pendingDraftRef.current = null;
      }
    },
    [enabled, habitId, contentType, onSaveError]
  );

  const debouncedSave = useCallback(
    (content: string) => {
      pendingDraftRef.current = content;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(
        () => void performSave(content),
        debounceMs
      );
    },
    [debounceMs, performSave]
  );

  const setDraft = useCallback(
    (value: string) => {
      setDraftState(value);
      if (wasRecovered && value !== draftRef.current) setWasRecovered(false);
      if (enabled && isInitialized) debouncedSave(value);
    },
    [
      enabled,
      isInitialized,
      debouncedSave,
      wasRecovered,
      setDraftState,
      setWasRecovered,
    ]
  );

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave(draftRef.current);
  }, [performSave]);

  const handleClearDraft = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await clearDraft(habitId, contentType);
    setDraftState('');
    setWasRecovered(false);
    pendingDraftRef.current = null;
  }, [habitId, contentType, setDraftState, setWasRecovered]);

  return {
    clearDraft: handleClearDraft,
    discardRecoveredDraft: handleClearDraft,
    draft,
    hasDraft: draft.trim().length > 0,
    isSaving: pendingDraftRef.current !== null,
    saveNow,
    setDraft,
    wasRecovered,
  };
}

export default useDraftStorage;
