/**
 * useDraftStorage - Auto-saves drafts for long-form content
 *
 * Features:
 * - Debounced auto-save (1000ms default delay)
 * - AsyncStorage-based persistence (cross-platform)
 * - Draft recovery on mount
 * - Automatic cleanup on successful save
 */
export { useDraftStorage, default } from './useDraftStorage';
export type {
  DraftContentType,
  UseDraftStorageOptions,
  UseDraftStorageReturn,
} from './types';
export {
  clearAllDraftsForHabit,
  clearDraft,
  getAllDraftKeys,
  getDraft,
  getDraftKey,
  saveDraft,
} from './storage';
