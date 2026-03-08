/**
 * useDraftStorage Type Definitions
 */

/** Content types that can be auto-saved */
export type DraftContentType =
  | 'why'
  | 'identity'
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

/** Draft data structure stored in AsyncStorage */
export interface StoredDraft {
  content: string;
  timestamp: number;
  version: 1;
}

/** Configuration options for the hook */
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

/** Return value from the hook */
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
