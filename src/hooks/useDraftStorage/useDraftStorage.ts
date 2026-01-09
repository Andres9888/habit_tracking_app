/**
 * useDraftStorage Hook - Auto-saves drafts for long-form content
 */
import { useCallback, useRef } from 'react';

import { DEFAULT_DEBOUNCE_MS, DEFAULT_MAX_AGE_MS } from './constants';
import { clearDraft } from './storage';
import type { UseDraftStorageOptions, UseDraftStorageReturn } from './types';
import { useDraftRecovery } from './useDraftRecovery';
import { useDraftSaveOperations } from './useDraftSaveOperations';

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

  const draftRef = useRef(draft);
  draftRef.current = draft;

  const { debouncedSave, saveNow, cancelPending, isSaving } =
    useDraftSaveOperations({
      contentType,
      debounceMs,
      enabled,
      getDraftValue: () => draftRef.current,
      habitId,
      isInitialized,
      onSaveError,
    });

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

  const handleClearDraft = useCallback(async () => {
    cancelPending();
    await clearDraft(habitId, contentType);
    setDraftState('');
    setWasRecovered(false);
  }, [habitId, contentType, setDraftState, setWasRecovered, cancelPending]);

  return {
    clearDraft: handleClearDraft,
    discardRecoveredDraft: handleClearDraft,
    draft,
    hasDraft: draft.trim().length > 0,
    isSaving,
    saveNow,
    setDraft,
    wasRecovered,
  };
}

export default useDraftStorage;
