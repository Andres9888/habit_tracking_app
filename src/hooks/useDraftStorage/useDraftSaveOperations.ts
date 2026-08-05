/**
 * Draft save operations hook
 * Handles debounced saving and immediate saves
 */

import { useCallback, useEffect, useRef } from 'react';
import { saveDraft } from './storage';
import type { DraftContentType } from './types';

interface UseDraftSaveOperationsParams {
  habitId: string;
  contentType: DraftContentType;
  debounceMs: number;
  enabled: boolean;
  isInitialized: boolean;
  onSaveError?: (error: Error) => void;
  getDraftValue: () => string;
}

export function useDraftSaveOperations({
  habitId,
  contentType,
  debounceMs,
  enabled,
  isInitialized,
  onSaveError,
  getDraftValue,
}: UseDraftSaveOperationsParams) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraftRef = useRef<string | null>(null);

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
      if (!enabled || !isInitialized) return;
      pendingDraftRef.current = content;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(
        () => void performSave(content),
        debounceMs
      );
    },
    [debounceMs, performSave, enabled, isInitialized]
  );

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave(getDraftValue());
  }, [performSave, getDraftValue]);

  const cancelPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    pendingDraftRef.current = null;
  }, []);

  return {
    cancelPending,
    debouncedSave,
    isSaving: pendingDraftRef.current !== null,
    saveNow,
  };
}
