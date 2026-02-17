/**
 * useDraftStorage Hook - Auto-saves drafts for long-form content
 */
import { useCallback, useRef } from 'react';

import { DEFAULT_DEBOUNCE_MS, DEFAULT_MAX_AGE_MS } from './constants';
import { clearDraft } from './storage';
import type { UseDraftStorageOptions, UseDraftStorageReturn } from './types';
import { useDraftRecovery } from './useDraftRecovery';
import { useDraftSaveOperations } from './useDraftSaveOperations';

/**
 * Hook for auto-saving drafts with recovery on app restart.
 * Prevents data loss when writing notes or letters by continuously saving to AsyncStorage.
 *
 * @description
 * Features:
 * - Automatic debounced saves (default: 500ms after typing stops)
 * - Draft recovery on mount (if draft exists and isn't too old)
 * - Manual save trigger for immediate persistence
 * - Age-based draft expiration (default: 7 days)
 * - Per-habit, per-content-type storage isolation
 *
 * Use cases:
 * - Writing habit notes
 * - Composing letters to self
 * - Any long-form user input that would be painful to lose
 *
 * @param options - Configuration options
 * @param options.habitId - Habit ID for isolating drafts
 * @param options.contentType - Content type ('note' | 'letter') for namespace isolation
 * @param options.debounceMs - Milliseconds to wait before auto-saving (default: 500)
 * @param options.enabled - Whether auto-save is enabled (default: true)
 * @param options.maxAgeMs - Max age for draft recovery (default: 7 days)
 * @param options.onDraftRecovered - Callback when draft is recovered on mount
 * @param options.onSaveError - Callback when save fails
 * @returns Object with draft state and control functions
 *
 * @example
 * ```tsx
 * function NoteEditor({ habitId }) {
 *   const {
 *     draft,
 *     setDraft,
 *     clearDraft,
 *     saveNow,
 *     wasRecovered,
 *     isSaving
 *   } = useDraftStorage({
 *     habitId,
 *     contentType: 'note',
 *     onDraftRecovered: () => toast.info('Draft recovered!')
 *   });
 *
 *   return (
 *     <View>
 *       {wasRecovered && <Text>Draft recovered from previous session</Text>}
 *       <TextInput
 *         value={draft}
 *         onChangeText={setDraft}
 *         placeholder="Write your note..."
 *       />
 *       <Button onPress={saveNow}>Save Now</Button>
 *       <Button onPress={clearDraft}>Discard Draft</Button>
 *       {isSaving && <Text>Saving...</Text>}
 *     </View>
 *   );
 * }
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
